import { FinalScores, ProfileBenchmark, BenchmarkData, BenchmarkStats } from '../types';
import { BenchmarkModel, ArchetypeModel } from '../db/models';
import { ProfileModel } from '../db/database';

/**
 * Benchmarking Service - Compares individual profiles against global dataset
 */
export class BenchmarkingService {
  
  /**
   * Calculate and update global benchmark statistics
   * Should be run periodically (e.g., nightly) to keep benchmarks current
   */
  async updateGlobalBenchmarks(): Promise<void> {
    try {
      const allProfiles = await ProfileModel.find({}, 'scores');
      
      if (allProfiles.length === 0) {
        console.warn('No profiles found for benchmark calculation');
        return;
      }

      const traits = [
        'analytical', 'intuitionDriven', 'sequential', 'improviser',
        'riskNeutral', 'comfortSeeker', 'clarityFirst', 'fastDecider',
        'overthinker', 'patternSeeker'
      ];

      for (const trait of traits) {
        const values = allProfiles
          .map((p: any) => p.scores[trait])
          .filter((v: any) => v !== undefined && v !== null)
          .sort((a: number, b: number) => a - b);

        if (values.length === 0) continue;

        const stats = this.calculateStatistics(values);

        await BenchmarkModel.findOneAndUpdate(
          { trait },
          {
            trait,
            statistics: stats,
            sampleSize: values.length,
            lastUpdated: new Date(),
          },
          { upsert: true, new: true }
        );
      }

      console.log('✅ Global benchmarks updated successfully');
    } catch (error) {
      console.error('❌ Error updating benchmarks:', error);
      throw error;
    }
  }

  /**
   * Calculate statistical metrics for a set of values
   */
  private calculateStatistics(values: number[]): BenchmarkStats {
    const n = values.length;
    const mean = values.reduce((sum, v) => sum + v, 0) / n;
    const median = this.calculatePercentile(values, 50);
    
    // Standard deviation
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
    const std = Math.sqrt(variance);

    return {
      mean,
      median,
      std,
      min: values[0],
      max: values[n - 1],
      percentiles: {
        p10: this.calculatePercentile(values, 10),
        p25: this.calculatePercentile(values, 25),
        p50: median,
        p75: this.calculatePercentile(values, 75),
        p90: this.calculatePercentile(values, 90),
        p95: this.calculatePercentile(values, 95),
        p99: this.calculatePercentile(values, 99),
      },
    };
  }

  /**
   * Calculate percentile for sorted array
   */
  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) return sortedValues[lower];
    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }

  /**
   * Get benchmark analysis for a specific profile
   */
  async getBenchmarkForProfile(profileId: string): Promise<ProfileBenchmark> {
    const profile = await ProfileModel.findOne({ profileId });
    if (!profile || !profile.scores) {
      throw new Error(`Profile ${profileId} not found`);
    }

    const scores = profile.scores as FinalScores;
    const traits = Object.keys(scores);
    
    const percentiles: { [key: string]: number } = {};
    const traitSkew: { [key: string]: number } = {};
    const aboveAverage: string[] = [];
    const belowAverage: string[] = [];
    const extremeTraits: string[] = [];

    for (const trait of traits) {
      const benchmark = await BenchmarkModel.findOne({ trait });
      if (!benchmark || !benchmark.statistics) continue;

      const userScore = scores[trait];
      const stats = benchmark.statistics as BenchmarkStats;

      // Calculate percentile
      const percentile = this.scoreToPercentile(userScore, stats);
      percentiles[trait] = percentile;

      // Calculate skew (z-score)
      const skew = (userScore - (stats.mean || 0)) / (stats.std || 1);
      traitSkew[trait] = skew;

      // Categorize
      if (userScore > (stats.mean || 0)) {
        aboveAverage.push(trait);
      } else if (userScore < (stats.mean || 0)) {
        belowAverage.push(trait);
      }

      // Extreme traits (>90th or <10th percentile)
      if (percentile > 90 || percentile < 10) {
        extremeTraits.push(trait);
      }
    }

    // Calculate overall divergence score
    const divergenceScore = this.calculateDivergenceScore(traitSkew);

    // Determine archetype
    const archetype = await this.determineArchetype(scores);

    return {
      profileId,
      scores,
      percentiles,
      divergenceScore,
      traitSkew,
      archetype: archetype?.name,
      globalComparison: {
        aboveAverage,
        belowAverage,
        extremeTraits,
      },
    };
  }

  /**
   * Convert a score to percentile based on benchmark stats
   */
  private scoreToPercentile(score: number, stats: BenchmarkStats): number {
    // Use z-score approach for smooth percentile estimation
    const z = (score - stats.mean) / stats.std;
    // Approximate normal CDF
    const percentile = this.normalCDF(z) * 100;
    return Math.max(0, Math.min(100, percentile));
  }

  /**
   * Approximate normal cumulative distribution function
   */
  private normalCDF(z: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  }

  /**
   * Calculate overall divergence from average profile
   */
  private calculateDivergenceScore(traitSkew: { [key: string]: number }): number {
    const skewValues = Object.values(traitSkew);
    const sumOfSquares = skewValues.reduce((sum, skew) => sum + skew * skew, 0);
    // Euclidean distance in z-score space
    return Math.sqrt(sumOfSquares);
  }

  /**
   * Determine cognitive archetype based on trait pattern
   */
  private async determineArchetype(scores: FinalScores): Promise<any | null> {
    const archetypes = await ArchetypeModel.find({});
    
    if (archetypes.length === 0) {
      // Initialize default archetypes if none exist
      await this.initializeDefaultArchetypes();
      return this.determineArchetype(scores);
    }

    let bestMatch = null;
    let bestScore = -Infinity;

    for (const archetype of archetypes) {
      const matchScore = this.calculateArchetypeMatch(scores, archetype.characteristicPattern);
      if (matchScore > bestScore) {
        bestScore = matchScore;
        bestMatch = archetype;
      }
    }

    return bestMatch;
  }

  /**
   * Calculate how well a profile matches an archetype pattern
   */
  private calculateArchetypeMatch(scores: FinalScores, pattern: any): number {
    const traits = Object.keys(scores).filter(t => t !== 'constructor');
    let totalDifference = 0;

    for (const trait of traits) {
      if (pattern[trait] !== undefined && typeof scores[trait] === 'number') {
        const diff = Math.abs(scores[trait] - pattern[trait]);
        totalDifference += diff;
      }
    }

    // Lower difference = better match; convert to positive score
    return -totalDifference;
  }

  /**
   * Initialize default cognitive archetypes
   */
  private async initializeDefaultArchetypes(): Promise<void> {
    const defaultArchetypes = [
      {
        name: 'Strategic Analyzer',
        description: 'High analytical, sequential, clarity-first thinking',
        dominantTraits: ['analytical', 'sequential', 'clarityFirst'],
        characteristicPattern: {
          analytical: 85,
          sequential: 80,
          clarityFirst: 85,
          intuitionDriven: 30,
          improviser: 25,
        },
        profileIds: [],
      },
      {
        name: 'Creative Innovator',
        description: 'High intuition, improvisation, pattern-seeking',
        dominantTraits: ['intuitionDriven', 'improviser', 'patternSeeker'],
        characteristicPattern: {
          intuitionDriven: 85,
          improviser: 80,
          patternSeeker: 85,
          analytical: 35,
          sequential: 30,
        },
        profileIds: [],
      },
      {
        name: 'Balanced Pragmatist',
        description: 'Moderate scores across all traits, adaptable',
        dominantTraits: [],
        characteristicPattern: {
          analytical: 50,
          intuitionDriven: 50,
          sequential: 50,
          improviser: 50,
          riskNeutral: 50,
          comfortSeeker: 50,
          clarityFirst: 50,
          fastDecider: 50,
          overthinker: 50,
          patternSeeker: 50,
        },
        profileIds: [],
      },
      {
        name: 'Rapid Executor',
        description: 'Fast decision-making, risk-neutral, action-oriented',
        dominantTraits: ['fastDecider', 'riskNeutral', 'improviser'],
        characteristicPattern: {
          fastDecider: 85,
          riskNeutral: 80,
          improviser: 75,
          overthinker: 20,
          comfortSeeker: 25,
        },
        profileIds: [],
      },
      {
        name: 'Deliberate Planner',
        description: 'High sequential, overthinking, comfort-seeking',
        dominantTraits: ['sequential', 'overthinker', 'comfortSeeker'],
        characteristicPattern: {
          sequential: 85,
          overthinker: 75,
          comfortSeeker: 80,
          fastDecider: 20,
          improviser: 25,
        },
        profileIds: [],
      },
    ];

    for (const archetype of defaultArchetypes) {
      await ArchetypeModel.findOneAndUpdate(
        { name: archetype.name },
        archetype,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Default archetypes initialized');
  }

  /**
   * Get all benchmark data
   */
  async getAllBenchmarks(): Promise<BenchmarkData[]> {
    return await BenchmarkModel.find({});
  }

  /**
   * Get all cognitive archetypes
   */
  async getAllArchetypes(): Promise<any[]> {
    return await ArchetypeModel.find({});
  }
}

export const benchmarkingService = new BenchmarkingService();
