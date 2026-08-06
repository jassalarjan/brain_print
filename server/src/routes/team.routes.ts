import { Router } from 'express';
import {
  createTeam,
  getTeam,
  updateTeamMembers,
  getTeamAnalysis,
  getAllTeams,
  deleteTeam,
} from '../controllers/team.controller';

const router = Router();

// Create a new team
router.post('/', createTeam);

// Get all teams
router.get('/', getAllTeams);

// Get a specific team
router.get('/:teamId', getTeam);

// Update team members
router.patch('/:teamId/members', updateTeamMembers);

// Get comprehensive team analysis
router.get('/:teamId/analysis', getTeamAnalysis);

// Delete a team
router.delete('/:teamId', deleteTeam);

export default router;
