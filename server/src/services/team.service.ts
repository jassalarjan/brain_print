import { nanoid } from 'nanoid';
import { TeamProfile, TeamAnalysis, FinalScores } from '../types';
import { TeamModel } from '../db/models';
import { ProfileModel } from '../db/database';

/**
 * Team Cognitive Mapping Service
 */
export class TeamService {
  
  /**
   * Create a new team
   */
  async createTeam(
    name: string,
    memberProfiles: string[],
    description?: string
  ): Promise<TeamProfile> {
    const teamId = nanoid(10);

    // Validate that all member profiles exist
    for (const profileId of memberProfiles) {
      const profile = await ProfileModel.findOne({ profileId });
      if (!profile) {
        throw new Error(`Profile ${profileId} not found`);
      }
    }

    // Calculate aggregate scores
    const aggregateScores = await this.calculateAggregateScores(memberProfiles);

    // Calculate diversity metrics
    const diversityMetrics = await this.calculateDiversityMetrics(memberProfiles);

    const team = await TeamModel.create({
      teamId,
      name,
      description: description || '',
      memberProfiles,
      aggregateScores,
      diversityMetrics,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return team.toObject() as TeamProfile;
  }

  /**
   * Get team by ID
   */
  async getTeam(teamId: string): Promise<TeamProfile | null> {
    const team = await TeamModel.findOne({ teamId });
    return team ? (team.toObject() as TeamProfile) : null;
  }

  /**
   * Update team members
   */
  async updateTeamMembers(teamId: string, memberProfiles: string[]): Promise<TeamProfile> {
    const team = await TeamModel.findOne({ teamId });
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    // Validate profiles
    for (const profileId of memberProfiles) {
      const profile = await ProfileModel.findOne({ profileId });
      if (!profile) {
        throw new Error(`Profile ${profileId} not found`);
      }
    }

    // Recalculate metrics
    const aggregateScores = await this.calculateAggregateScores(memberProfiles);
    const diversityMetrics = await this.calculateDiversityMetrics(memberProfiles);

    team.memberProfiles = memberProfiles;
    team.aggregateScores = aggregateScores;
    team.diversityMetrics = diversityMetrics;
    team.updatedAt = new Date();

    await team.save();
    return team.toObject() as TeamProfile;
  }

  /**
   * Calculate aggregate statistics for team
   */
  private async calculateAggregateScores(memberProfiles: string[]): Promise<any> {
    const profiles = await ProfileModel.find({ profileId: { $in: memberProfiles } });
    
    const traits = [
      'analytical', 'intuitionDriven', 'sequential', 'improviser',
      'riskNeutral', 'comfortSeeker', 'clarityFirst', 'fastDecider',
      'overthinker', 'patternSeeker'
    ];

    const aggregateScores: any = {};

    for (const trait of traits) {
      const values = profiles.map((p: any) => p.scores[trait]).filter((v: any) => v !== undefined);
      
      if (values.length === 0) continue;

      const sorted = [...values].sort((a: number, b: number) => a - b);
      const mean = values.reduce((sum: number, v: number) => sum + v, 0) / values.length;
      const median = sorted[Math.floor(sorted.length / 2)];
      
      // Standard deviation
      const variance = values.reduce((sum: number, v: number) => sum + Math.pow(v - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);

      aggregateScores[trait] = { mean, median, std };
    }

    return aggregateScores;
  }

  /**
   * Calculate diversity metrics for team
   */
  private async calculateDiversityMetrics(memberProfiles: string[]): Promise<any> {
    const profiles = await ProfileModel.find({ profileId: { $in: memberProfiles } });
    
    const traits = [
      'analytical', 'intuitionDriven', 'sequential', 'improviser',
      'riskNeutral', 'comfortSeeker', 'clarityFirst', 'fastDecider',
      'overthinker', 'patternSeeker'
    ];

    const traitVariance: any = {};
    let totalVariance = 0;

    for (const trait of traits) {
      const values = profiles.map((p: any) => p.scores[trait]).filter((v: any) => v !== undefined);
      
      if (values.length === 0) continue;

      const mean = values.reduce((sum: number, v: number) => sum + v, 0) / values.length;
      const variance = values.reduce((sum: number, v: number) => sum + Math.pow(v - mean, 2), 0) / values.length;
      
      traitVariance[trait] = variance;
      totalVariance += variance;
    }

    // Overall diversity score (0-100 scale, normalized)
    const overallDiversity = Math.min(100, (totalVariance / traits.length) * 2);

    return {
      overallDiversity,
      traitVariance,
    };
  }

  /**
   * Get comprehensive team analysis
   */
  async getTeamAnalysis(teamId: string): Promise<TeamAnalysis> {
    const team = await this.getTeam(teamId);
    if (!team) {
      throw new Error(`Team ${teamId} not found`);
    }

    const profiles = await ProfileModel.find({ profileId: { $in: team.memberProfiles } });

    // Build diversity heatmap
    const diversityHeatmap = team.diversityMetrics.traitVariance;

    // Calculate synergy matrix
    const synergyMatrix = this.calculateSynergyMatrix(profiles);

    // Calculate strength distribution
    const strengthDistribution = this.calculateStrengthDistribution(profiles);

    // Predict potential conflicts
    const conflictPredictions = this.predictConflicts(profiles);

    // Generate recommendations
    const recommendations = this.generateTeamRecommendations(team, profiles);

    return {
      team,
      diversityHeatmap,
      synergyMatrix,
      strengthDistribution,
      conflictPredictions,
      recommendations,
    };
  }

  /**
   * Calculate synergy scores between all team member pairs
   */
  private calculateSynergyMatrix(profiles: any[]): Array<{
    member1: string;
    member2: string;
    synergyScore: number;
  }> {
    const matrix: Array<{ member1: string; member2: string; synergyScore: number }> = [];

    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const profile1 = profiles[i];
        const profile2 = profiles[j];

        // Calculate complementarity (inverse of similarity)
        const synergyScore = this.calculateComplementarity(profile1.scores, profile2.scores);

        matrix.push({
          member1: profile1.profileId,
          member2: profile2.profileId,
          synergyScore,
        });
      }
    }

    return matrix;
  }

  /**
   * Calculate complementarity between two profiles
   */
  private calculateComplementarity(scores1: FinalScores, scores2: FinalScores): number {
    const traits = Object.keys(scores1);
    let complementaritySum = 0;

    for (const trait of traits) {
      // Complementarity is high when one is strong where the other is weak
      const diff = Math.abs(scores1[trait] - scores2[trait]);
      // Normalize to 0-100 scale
      complementaritySum += diff;
    }

    // Average complementarity across traits
    return complementaritySum / traits.length;
  }

  /**
   * Calculate strength distribution across the team
   */
  private calculateStrengthDistribution(profiles: any[]): {
    [trait: string]: { strong: number; moderate: number; weak: number };
  } {
    const traits = [
      'analytical', 'intuitionDriven', 'sequential', 'improviser',
      'riskNeutral', 'comfortSeeker', 'clarityFirst', 'fastDecider',
      'overthinker', 'patternSeeker'
    ];

    const distribution: any = {};

    for (const trait of traits) {
      let strong = 0;
      let moderate = 0;
      let weak = 0;

      for (const profile of profiles) {
        const score = profile.scores[trait];
        if (score >= 70) strong++;
        else if (score >= 40) moderate++;
        else weak++;
      }

      distribution[trait] = { strong, moderate, weak };
    }

    return distribution;
  }

  /**
   * Predict potential conflicts based on trait distributions
   */
  private predictConflicts(profiles: any[]): Array<{
    members: string[];
    trait: string;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
  }> {
    const conflicts: Array<any> = [];

    // Check for extreme opposites in key decision-making traits
    const criticalTraits = ['analytical', 'intuitionDriven', 'sequential', 'improviser', 'fastDecider', 'overthinker'];

    for (const trait of criticalTraits) {
      const values = profiles.map(p => ({ id: p.profileId, score: p.scores[trait] }));
      const sorted = [...values].sort((a, b) => b.score - a.score);

      // Check for large gaps (>50 points)
      for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i].score - sorted[sorted.length - 1].score;
        
        if (gap > 50) {
          const riskLevel = gap > 70 ? 'high' : gap > 60 ? 'medium' : 'low';
          
          conflicts.push({
            members: [sorted[i].id, sorted[sorted.length - 1].id],
            trait,
            riskLevel,
            description: `Significant difference in ${trait}: potential for misalignment in approach`,
          });
        }
      }
    }

    return conflicts.slice(0, 5); // Top 5 potential conflicts
  }

  /**
   * Generate recommendations for team optimization
   */
  private generateTeamRecommendations(team: TeamProfile, profiles: any[]): string[] {
    const recommendations: string[] = [];

    // Check diversity
    if (team.diversityMetrics.overallDiversity < 30) {
      recommendations.push('Consider adding members with different cognitive styles to increase team diversity');
    }

    // Check for gaps in coverage
    const strengthDist = this.calculateStrengthDistribution(profiles);
    for (const [trait, dist] of Object.entries(strengthDist)) {
      if (dist.strong === 0) {
        recommendations.push(`No strong ${trait} thinkers - consider recruiting for this strength`);
      }
    }

    // Check balance
    const analyticalVsIntuitive = Math.abs(
      team.aggregateScores.analytical?.mean - team.aggregateScores.intuitionDriven?.mean
    );
    
    if (analyticalVsIntuitive > 30) {
      recommendations.push('Team leans heavily toward one thinking style - consider balancing analytical vs intuitive members');
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  /**
   * Get all teams
   */
  async getAllTeams(): Promise<TeamProfile[]> {
    const teams = await TeamModel.find({}).sort({ createdAt: -1 });
    return teams.map(t => t.toObject()) as TeamProfile[];
  }

  /**
   * Delete team
   */
  async deleteTeam(teamId: string): Promise<boolean> {
    const result = await TeamModel.deleteOne({ teamId });
    return result.deletedCount > 0;
  }
}

export const teamService = new TeamService();
