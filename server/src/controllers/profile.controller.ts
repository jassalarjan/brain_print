import { Request, Response } from 'express';
import { storageService } from '../services/storage.service';
import { SaveProfileRequest } from '../types';

export class ProfileController {
  async save(req: Request, res: Response) {
    try {
      const { scores, answers }: SaveProfileRequest = req.body;

      if (!scores || !answers) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: scores and answers' 
        });
      }

      const profileId = await storageService.saveProfile(scores, answers);
      const shareUrl = `${req.protocol}://${req.get('host')}/profile/${profileId}`;

      res.json({ 
        success: true, 
        data: { profileId, shareUrl } 
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to save profile' 
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Profile ID is required' 
        });
      }

      const profile = await storageService.getProfile(id);

      if (!profile) {
        return res.status(404).json({ 
          success: false, 
          error: 'Profile not found' 
        });
      }

      res.json({ 
        success: true, 
        data: profile 
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch profile' 
      });
    }
  }
}

export const profileController = new ProfileController();