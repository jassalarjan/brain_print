import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authController.registerValidation, authController.register);
router.post('/login', authController.loginValidation, authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/password', authMiddleware, authController.updatePassword);
router.delete('/account', authMiddleware, authController.deactivateAccount);

export default router;
