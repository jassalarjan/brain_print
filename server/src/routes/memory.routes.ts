import { Router } from 'express';
import * as memoryController from '../controllers/memory.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', memoryController.createMemoryValidation, memoryController.createMemory);
router.get('/', memoryController.getMemories);
router.get('/search', memoryController.searchMemories);
router.get('/tag/:tag', memoryController.getMemoriesByTag);
router.get('/source/:source', memoryController.getMemoriesBySource);
router.get('/:memoryId', memoryController.getMemoryById);
router.put('/:memoryId', memoryController.updateMemory);
router.delete('/:memoryId', memoryController.deleteMemory);

export default router;
