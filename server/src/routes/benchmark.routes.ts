import { Router } from 'express';
import {
  getBenchmarkForProfile,
  updateGlobalBenchmarks,
  getAllBenchmarks,
  getAllArchetypes,
} from '../controllers/benchmark.controller';

const router = Router();

// Get benchmark analysis for a specific profile
router.get('/profile/:profileId', getBenchmarkForProfile);

// Update global benchmark statistics (admin operation)
router.post('/update', updateGlobalBenchmarks);

// Get all benchmark data
router.get('/', getAllBenchmarks);

// Get all cognitive archetypes
router.get('/archetypes', getAllArchetypes);

export default router;
