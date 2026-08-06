import { Request, Response } from 'express';
import { evolutionService } from '../services/evolution.service';

export const createSession = async (req: Request, res: Response) => {
  try {
    const { userId, scores, answers, metadata } = req.body;
    
    if (!userId || !scores || !answers) {
      return res.status(400).json({ error: 'Missing required fields: userId, scores, answers' });
    }

    const session = await evolutionService.createSession(userId, scores, answers, metadata);
    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const sessions = await evolutionService.getUserSessions(userId);
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvolutionData = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const evolutionData = await evolutionService.getEvolutionData(userId);
    res.json(evolutionData);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await evolutionService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const compareSessions = async (req: Request, res: Response) => {
  try {
    const { sessionId1, sessionId2 } = req.query;
    
    if (!sessionId1 || !sessionId2) {
      return res.status(400).json({ error: 'Both sessionId1 and sessionId2 are required' });
    }

    const comparison = await evolutionService.compareSessions(
      sessionId1 as string,
      sessionId2 as string
    );
    res.json(comparison);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getEvolutionSummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const summary = await evolutionService.getEvolutionSummary(userId);
    res.json(summary);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const deleted = await evolutionService.deleteSession(sessionId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
