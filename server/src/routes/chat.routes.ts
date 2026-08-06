import { Router } from 'express';
import * as chatController from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/message', chatController.sendMessageValidation, chatController.sendMessage);
router.get('/history', chatController.getChatHistory);
router.get('/search', chatController.searchChat);

export default router;
