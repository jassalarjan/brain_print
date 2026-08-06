import { Router } from 'express';
import * as triggerController from '../controllers/trigger.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', triggerController.createTriggerValidation, triggerController.createTrigger);
router.get('/', triggerController.getTriggers);
router.get('/:triggerId', triggerController.getTriggerById);
router.put('/:triggerId', triggerController.updateTrigger);
router.patch('/:triggerId/toggle', triggerController.toggleTrigger);
router.delete('/:triggerId', triggerController.deleteTrigger);

export default router;
