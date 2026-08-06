import { nanoid } from 'nanoid';
import { CognitivePairing, AlignmentMetrics, FrictionZone, Strength, FinalScores } from '../types';
import { PairingModel } from '../db/models';
import { ProfileModel } from '../db/database';

/**
 * Cognitive Pairing Service - Analyzes compatibility between two profiles
 */
export class PairingService {
  
  /**
   * Analyze cognitive pairing between two profiles
   */
  async analyzePairing(profileId1: string, profileId2: string): Promise<CognitivePairing> {
    // Fetch both profiles
    const profile1 = await ProfileModel.findOne({ profileId: profileId1 });
    const profile2 = await ProfileModel.findOne({ profileId: profileId2 });

    if (!profile1 || !profile2) {
      throw new Error('One or both profiles not found');
    }

    const pairingId = nanoid(10);

    const scores1 = profile1.scores as FinalScores;
    const scores2 = profile2.scores as FinalScores;

    // Calculate alignment metrics
    const alignmentMetrics = this.calculateAlignmentMetrics(scores1, scores2);

    // Calculate overall compatibility score
    const compatibilityScore = this.calculateCompatibilityScore(alignmentMetrics);

    // Calculate complementarity
    const complementarityScore = this.calculateComplementarityScore(scores1, scores2);

    // Identify friction zones
    const frictionZones = this.identifyFrictionZones(scores1, scores2);

    // Identify strengths
    const strengths = this.identifyStrengths(scores1, scores2);

    // Generate interaction model
    const interactionModel = this.generateInteractionModel(scores1, scores2);

    // Generate recommendations
    const recommendations = this.generatePairingRecommendations(
      alignmentMetrics,
      frictionZones,
      strengths
    );

    // Save pairing analysis
    const pairing = await PairingModel.create({
      pairingId,
      profileId1,
      profileId2,
      compatibilityScore,
      alignmentMetrics,
      complementarityScore,
      frictionZones,
      strengths,
      createdAt: new Date(),
    });

    return {
      pairingId,
      profileId1,
      profileId2,
      compatibilityScore,
      alignmentMetrics,
      complementarityScore,
      frictionZones,
      strengths,
      interactionModel,
      recommendations,
      createdAt: pairing.createdAt,
    };
  }

  /**
   * Calculate alignment metrics across key dimensions
   */
  private calculateAlignmentMetrics(scores1: FinalScores, scores2: FinalScores): AlignmentMetrics {
    // Communication alignment: analytical vs intuition-driven, clarity-first
    const communicationAlignment = this.calculateDimensionAlignment(
      [scores1.analytical, scores1.clarityFirst],
      [scores2.analytical, scores2.clarityFirst]
    );

    // Decision style alignment: fast-decider, overthinker
    const decisionStyleAlignment = this.calculateDimensionAlignment(
      [scores1.fastDecider, scores1.overthinker],
      [scores2.fastDecider, scores2.overthinker]
    );

    // Risk tolerance alignment: risk-neutral, comfort-seeker
    const riskToleranceAlignment = this.calculateDimensionAlignment(
      [scores1.riskNeutral, scores1.comfortSeeker],
      [scores2.riskNeutral, scores2.comfortSeeker]
    );

    // Processing style alignment: sequential, improviser, pattern-seeker
    const processingStyleAlignment = this.calculateDimensionAlignment(
      [scores1.sequential, scores1.improviser, scores1.patternSeeker],
      [scores2.sequential, scores2.improviser, scores2.patternSeeker]
    );

    return {
      communicationAlignment,
      decisionStyleAlignment,
      riskToleranceAlignment,
      processingStyleAlignment,
    };
  }

  /**
   * Calculate alignment for a specific dimension (0-100)
   */
  private calculateDimensionAlignment(traits1: number[], traits2: number[]): number {
    let totalDiff = 0;
    
    for (let i = 0; i < traits1.length; i++) {
      totalDiff += Math.abs(traits1[i] - traits2[i]);
    }

    const avgDiff = totalDiff / traits1.length;
    // Convert difference to alignment score (inverse relationship)
    return Math.max(0, 100 - avgDiff);
  }

  /**
   * Calculate overall compatibility score
   */
  private calculateCompatibilityScore(alignmentMetrics: AlignmentMetrics): number {
    const scores = [
      alignmentMetrics.communicationAlignment,
      alignmentMetrics.decisionStyleAlignment,
      alignmentMetrics.riskToleranceAlignment,
      alignmentMetrics.processingStyleAlignment,
    ];

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * Calculate complementarity score (how well they fill each other's gaps)
   */
  private calculateComplementarityScore(scores1: FinalScores, scores2: FinalScores): number {
    const traits = Object.keys(scores1) as Array<keyof FinalScores>;
    let complementaritySum = 0;

    for (const trait of traits) {
      const score1 = scores1[trait];
      const score2 = scores2[trait];

      // High complementarity when one is strong (>70) and other is weak (<30)
      if ((score1 > 70 && score2 < 30) || (score1 < 30 && score2 > 70)) {
        complementaritySum += 100;
      } else if ((score1 > 60 && score2 < 40) || (score1 < 40 && score2 > 60)) {
        complementaritySum += 50;
      }
    }

    return complementaritySum / traits.length;
  }

  /**
   * Identify friction zones (areas of potential conflict)
   */
  private identifyFrictionZones(scores1: FinalScores, scores2: FinalScores): FrictionZone[] {
    const frictionZones: FrictionZone[] = [];
    const traits = Object.keys(scores1) as Array<keyof FinalScores>;

    const criticalTraits = [
      'analytical', 'intuitionDriven', 'sequential', 'improviser',
      'fastDecider', 'overthinker', 'riskNeutral', 'comfortSeeker'
    ];

    for (const trait of criticalTraits) {
      const diff = Math.abs((scores1 as any)[trait] - (scores2 as any)[trait]);

      if (diff > 50) {
        const severity = diff > 70 ? 90 : diff > 60 ? 70 : 50;
        
        frictionZones.push({
          trait,
          severity,
          description: this.getFrictionDescription(trait, (scores1 as any)[trait], (scores2 as any)[trait]),
        });
      }
    }

    // Sort by severity
    return frictionZones.sort((a, b) => b.severity - a.severity);
  }

  /**
   * Get description for friction zone
   */
  private getFrictionDescription(trait: string, score1: number, score2: number): string {
    const higher = score1 > score2 ? 'Person 1' : 'Person 2';
    const lower = score1 > score2 ? 'Person 2' : 'Person 1';

    const descriptions: { [key: string]: string } = {
      analytical: `${higher} prefers data-driven decisions while ${lower} relies more on intuition`,
      intuitionDriven: `${higher} trusts gut feelings more than ${lower} who prefers structured analysis`,
      sequential: `${higher} needs step-by-step planning; ${lower} is comfortable with flexibility`,
      improviser: `${higher} adapts on the fly; ${lower} prefers predetermined plans`,
      fastDecider: `${higher} makes quick decisions; ${lower} needs more deliberation time`,
      overthinker: `${higher} analyzes deeply; ${lower} acts more decisively`,
      riskNeutral: `${higher} is comfortable with risk; ${lower} prefers safety`,
      comfortSeeker: `${higher} prioritizes stability; ${lower} is open to uncertainty`,
    };

    return descriptions[trait] || `Significant difference in ${trait} approach`;
  }

  /**
   * Identify collaborative strengths
   */
  private identifyStrengths(scores1: FinalScores, scores2: FinalScores): Strength[] {
    const strengths: Strength[] = [];
    const traits = Object.keys(scores1) as Array<keyof FinalScores>;

    // Both high in same trait
    for (const trait of traits) {
      if (scores1[trait] > 70 && scores2[trait] > 70) {
        strengths.push({
          area: `Shared ${trait}`,
          score: (scores1[trait] + scores2[trait]) / 2,
          description: `Both excel at ${trait} thinking - natural alignment`,
        });
      }
    }

    // Complementary strengths
    const complementaryPairs = [
      ['analytical', 'intuitionDriven'],
      ['sequential', 'improviser'],
      ['fastDecider', 'overthinker'],
      ['riskNeutral', 'comfortSeeker'],
    ];

    for (const [trait1, trait2] of complementaryPairs) {
      const t1 = trait1 as keyof FinalScores;
      const t2 = trait2 as keyof FinalScores;
      
      if ((scores1[t1] > 70 && scores2[t2] > 70) || (scores1[t2] > 70 && scores2[t1] > 70)) {
        strengths.push({
          area: `${trait1}/${trait2} balance`,
          score: 85,
          description: `Complementary ${trait1} and ${trait2} strengths create balanced approach`,
        });
      }
    }

    return strengths.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  /**
   * Generate interaction model description
   */
  private generateInteractionModel(scores1: FinalScores, scores2: FinalScores): string {
    const profile1Type = this.getProfileType(scores1);
    const profile2Type = this.getProfileType(scores2);

    return `${profile1Type} + ${profile2Type}: ${this.getInteractionPattern(profile1Type, profile2Type)}`;
  }

  /**
   * Determine profile type based on dominant traits
   */
  private getProfileType(scores: FinalScores): string {
    if (scores.analytical > 70 && scores.sequential > 70) return 'Strategic Planner';
    if (scores.intuitionDriven > 70 && scores.improviser > 70) return 'Creative Innovator';
    if (scores.fastDecider > 70 && scores.riskNeutral > 70) return 'Rapid Executor';
    if (scores.overthinker > 70 && scores.comfortSeeker > 70) return 'Careful Deliberator';
    if (scores.patternSeeker > 70) return 'Systems Thinker';
    return 'Balanced Generalist';
  }

  /**
   * Get interaction pattern description
   */
  private getInteractionPattern(type1: string, type2: string): string {
    const patterns: { [key: string]: string } = {
      'Strategic Planner-Creative Innovator': 'Structure meets creativity - powerful for innovation with execution',
      'Strategic Planner-Rapid Executor': 'Planning meets action - efficient and methodical',
      'Creative Innovator-Rapid Executor': 'Innovation meets speed - dynamic but may lack structure',
      'Careful Deliberator-Rapid Executor': 'Caution meets action - needs compromise on pace',
      'Strategic Planner-Strategic Planner': 'Double planning - thorough but may overthink',
      'Creative Innovator-Creative Innovator': 'Double innovation - exciting but may lack grounding',
    };

    const key = `${type1}-${type2}`;
    return patterns[key] || patterns[`${type2}-${type1}`] || 'Complementary collaboration potential';
  }

  /**
   * Generate recommendations for the pairing
   */
  private generatePairingRecommendations(
    alignmentMetrics: AlignmentMetrics,
    frictionZones: FrictionZone[],
    strengths: Strength[]
  ): string[] {
    const recommendations: string[] = [];

    // Based on alignment
    if (alignmentMetrics.communicationAlignment < 50) {
      recommendations.push('Establish clear communication protocols to bridge different thinking styles');
    }
    if (alignmentMetrics.decisionStyleAlignment < 50) {
      recommendations.push('Agree on decision-making timelines that accommodate both paces');
    }
    if (alignmentMetrics.riskToleranceAlignment < 50) {
      recommendations.push('Discuss risk tolerance explicitly before major decisions');
    }

    // Based on friction zones
    if (frictionZones.length > 3) {
      recommendations.push('Schedule regular alignment sessions to address cognitive differences');
    }

    // Based on strengths
    if (strengths.length > 2) {
      recommendations.push('Leverage shared strengths for maximum collaboration impact');
    }

    // General
    recommendations.push('Focus on complementary strengths rather than trying to change fundamental thinking styles');

    return recommendations.slice(0, 5);
  }

  /**
   * Get pairing by ID
   */
  async getPairing(pairingId: string): Promise<CognitivePairing | null> {
    const pairing = await PairingModel.findOne({ pairingId });
    
    if (!pairing) return null;

    const interactionModel = this.generateInteractionModel(
      pairing.profileId1 as any,
      pairing.profileId2 as any
    );

    const recommendations = this.generatePairingRecommendations(
      pairing.alignmentMetrics as AlignmentMetrics,
      pairing.frictionZones as FrictionZone[],
      pairing.strengths as Strength[]
    );

    return {
      ...pairing.toObject(),
      compatibilityScore: pairing.compatibilityScore || 0,
      complementarityScore: pairing.complementarityScore || 0,
      interactionModel,
      recommendations,
    } as CognitivePairing;
  }

  /**
   * Get all pairings for a profile
   */
  async getPairingsForProfile(profileId: string): Promise<CognitivePairing[]> {
    const pairings = await PairingModel.find({
      $or: [{ profileId1: profileId }, { profileId2: profileId }]
    }).sort({ createdAt: -1 });

    return pairings.map(p => ({
      ...p.toObject(),
      compatibilityScore: p.compatibilityScore || 0,
      complementarityScore: p.complementarityScore || 0,
      interactionModel: '',
      recommendations: [],
    } as CognitivePairing));
  }
}

export const pairingService = new PairingService();
