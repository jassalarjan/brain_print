import { nanoid } from 'nanoid';
import { FinalScores, UserAnswer, Session, EvolutionData } from '../types';
import { SessionModel } from '../db/models';
import { ProfileModel } from '../db/database';

/**
 * Evolution Tracking Service - Tracks cognitive changes over time
 */
export class EvolutionService {
  
  /**
   * Create a new session for a user
   */
  async createSession(
    userId: string,
    scores: FinalScores,
    answers: UserAnswer[],
    metadata?: { context?: string; notes?: string }
  ): Promise<Session> {
    const sessionId = nanoid(10);
    
    // Also create a profile for this session
    const profileId = nanoid(8);
    await ProfileModel.create({
      profileId,
      scores,
      answers,
      createdAt: new Date(),
    });

    const session = await SessionModel.create({
      userId,
      sessionId,
      profileId,
      scores,
      answers,
      metadata: metadata || {},
      createdAt: new Date(),
    });

    return session.toObject() as Session;
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    const sessions = await SessionModel.find({ userId }).sort({ createdAt: 1 });
    return sessions.map(s => s.toObject()) as Session[];
  }

  /**
   * Get evolution data with time-series and analysis
   */
  async getEvolutionData(userId: string): Promise<EvolutionData> {
    const sessions = await this.getUserSessions(userId);

    if (sessions.length < 2) {
      throw new Error('At least 2 sessions required for evolution analysis');
    }

    // Build time series
    const dates = sessions.map(s => s.createdAt);
    const traits = [
      'analytical', 'intuitionDriven', 'sequential', 'improviser',
      'riskNeutral', 'comfortSeeker', 'clarityFirst', 'fastDecider',
      'overthinker', 'patternSeeker'
    ];

    const timeSeries: any = { dates, traits: {} };
    
    for (const trait of traits) {
      timeSeries.traits[trait] = sessions.map(s => (s.scores as any)[trait]);
    }

    // Calculate drift analysis
    const driftAnalysis = this.calculateDrift(sessions);

    // Calculate change velocity
    const changeVelocity = this.calculateChangeVelocity(sessions);

    return {
      userId,
      sessions,
      timeSeries,
      driftAnalysis,
      changeVelocity,
    };
  }

  /**
   * Calculate cognitive drift between sessions
   */
  private calculateDrift(sessions: Session[]): {
    overallDrift: number;
    traitDrifts: { [key: string]: number };
    stability: number;
  } {
    const firstSession = sessions[0];
    const lastSession = sessions[sessions.length - 1];

    const traits = Object.keys(firstSession.scores);
    const traitDrifts: { [key: string]: number } = {};
    let totalDrift = 0;

    for (const trait of traits) {
      const drift = Math.abs((lastSession.scores as any)[trait] - (firstSession.scores as any)[trait]);
      traitDrifts[trait] = drift;
      totalDrift += drift;
    }

    const overallDrift = totalDrift / traits.length;
    
    // Stability: inverse of drift (0-100 scale)
    const stability = Math.max(0, 100 - overallDrift);

    return {
      overallDrift,
      traitDrifts,
      stability,
    };
  }

  /**
   * Calculate rate of change (velocity) for each trait
   */
  private calculateChangeVelocity(sessions: Session[]): { [key: string]: number } {
    if (sessions.length < 2) {
      return {};
    }

    const traits = Object.keys(sessions[0].scores);
    const velocity: { [key: string]: number } = {};

    for (const trait of traits) {
      let totalChange = 0;
      
      for (let i = 1; i < sessions.length; i++) {
        const change = (sessions[i].scores as any)[trait] - (sessions[i - 1].scores as any)[trait];
        totalChange += Math.abs(change);
      }

      // Average change per session
      velocity[trait] = totalChange / (sessions.length - 1);
    }

    return velocity;
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const session = await SessionModel.findOne({ sessionId });
    return session ? (session.toObject() as Session) : null;
  }

  /**
   * Compare two specific sessions
   */
  async compareSessions(sessionId1: string, sessionId2: string): Promise<{
    session1: Session;
    session2: Session;
    differences: { [key: string]: number };
    significantChanges: Array<{ trait: string; change: number; direction: 'increase' | 'decrease' }>;
  }> {
    const session1 = await this.getSession(sessionId1);
    const session2 = await this.getSession(sessionId2);

    if (!session1 || !session2) {
      throw new Error('One or both sessions not found');
    }

    const traits = Object.keys(session1.scores);
    const differences: { [key: string]: number } = {};
    const significantChanges: Array<{ trait: string; change: number; direction: 'increase' | 'decrease' }> = [];

    for (const trait of traits) {
      const diff = (session2.scores as any)[trait] - (session1.scores as any)[trait];
      differences[trait] = diff;

      // Significant change threshold: >10 points
      if (Math.abs(diff) > 10) {
        significantChanges.push({
          trait,
          change: Math.abs(diff),
          direction: diff > 0 ? 'increase' : 'decrease',
        });
      }
    }

    return {
      session1,
      session2,
      differences,
      significantChanges,
    };
  }

  /**
   * Get evolution summary for a user
   */
  async getEvolutionSummary(userId: string): Promise<{
    totalSessions: number;
    firstSessionDate: Date;
    lastSessionDate: Date;
    mostStableTraits: string[];
    mostVolatileTraits: string[];
    overallTrend: 'stable' | 'evolving' | 'transforming';
  }> {
    const sessions = await this.getUserSessions(userId);

    if (sessions.length < 2) {
      throw new Error('At least 2 sessions required for summary');
    }

    const driftAnalysis = this.calculateDrift(sessions);
    const velocity = this.calculateChangeVelocity(sessions);

    // Sort traits by drift (stability)
    const traitsByDrift = Object.entries(driftAnalysis.traitDrifts)
      .sort((a, b) => a[1] - b[1]);

    const mostStableTraits = traitsByDrift.slice(0, 3).map(([trait]) => trait);
    const mostVolatileTraits = traitsByDrift.slice(-3).map(([trait]) => trait);

    // Determine overall trend
    let overallTrend: 'stable' | 'evolving' | 'transforming';
    if (driftAnalysis.overallDrift < 10) {
      overallTrend = 'stable';
    } else if (driftAnalysis.overallDrift < 30) {
      overallTrend = 'evolving';
    } else {
      overallTrend = 'transforming';
    }

    return {
      totalSessions: sessions.length,
      firstSessionDate: sessions[0].createdAt,
      lastSessionDate: sessions[sessions.length - 1].createdAt,
      mostStableTraits,
      mostVolatileTraits,
      overallTrend,
    };
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    const result = await SessionModel.deleteOne({ sessionId });
    return result.deletedCount > 0;
  }
}

export const evolutionService = new EvolutionService();
