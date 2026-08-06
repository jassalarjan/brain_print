import { Router } from 'express';
import {
  createSession,
  getUserSessions,
  getEvolutionData,
  getSession,
  compareSessions,
  getEvolutionSummary,
  deleteSession,
} from '../controllers/evolution.controller';

const router = Router();

// Create a new session
router.post('/', createSession);

// Get all sessions for a user
router.get('/user/:userId', getUserSessions);

// Get evolution data with analysis for a user
router.get('/user/:userId/data', getEvolutionData);

// Get evolution summary for a user
router.get('/user/:userId/summary', getEvolutionSummary);

// Get a specific session
router.get('/:sessionId', getSession);

// Compare two sessions
router.get('/compare', compareSessions);

// Delete a session
router.delete('/:sessionId', deleteSession);

export default router;
