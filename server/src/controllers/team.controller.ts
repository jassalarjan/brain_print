import { Request, Response } from 'express';
import { teamService } from '../services/team.service';

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, memberProfiles, description } = req.body;
    
    if (!name || !memberProfiles || !Array.isArray(memberProfiles)) {
      return res.status(400).json({ error: 'Missing required fields: name, memberProfiles (array)' });
    }

    const team = await teamService.createTeam(name, memberProfiles, description);
    res.status(201).json(team);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const team = await teamService.getTeam(teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTeamMembers = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const { memberProfiles } = req.body;
    
    if (!memberProfiles || !Array.isArray(memberProfiles)) {
      return res.status(400).json({ error: 'memberProfiles array is required' });
    }

    const team = await teamService.updateTeamMembers(teamId, memberProfiles);
    res.json(team);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTeamAnalysis = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const analysis = await teamService.getTeamAnalysis(teamId);
    res.json(analysis);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await teamService.getAllTeams();
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const deleted = await teamService.deleteTeam(teamId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
