import { Router } from 'express';
import {
  analyzePairing,
  getPairing,
  getPairingsForProfile,
} from '../controllers/pairing.controller';

const router = Router();

// Analyze cognitive pairing between two profiles
router.post('/', analyzePairing);

// Get a specific pairing analysis
router.get('/:pairingId', getPairing);

// Get all pairings for a profile
router.get('/profile/:profileId', getPairingsForProfile);

export default router;
