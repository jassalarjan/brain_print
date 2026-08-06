import { Request, Response } from 'express';
import { pairingService } from '../services/pairing.service';

export const analyzePairing = async (req: Request, res: Response) => {
  try {
    const { profileId1, profileId2 } = req.body;
    
    if (!profileId1 || !profileId2) {
      return res.status(400).json({ error: 'Both profileId1 and profileId2 are required' });
    }

    if (profileId1 === profileId2) {
      return res.status(400).json({ error: 'Cannot pair a profile with itself' });
    }

    const pairing = await pairingService.analyzePairing(profileId1, profileId2);
    res.status(201).json(pairing);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPairing = async (req: Request, res: Response) => {
  try {
    const { pairingId } = req.params;
    const pairing = await pairingService.getPairing(pairingId);
    
    if (!pairing) {
      return res.status(404).json({ error: 'Pairing not found' });
    }
    
    res.json(pairing);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPairingsForProfile = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const pairings = await pairingService.getPairingsForProfile(profileId);
    res.json(pairings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
