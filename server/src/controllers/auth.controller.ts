import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { TriggerService } from '../services/trigger.service';
import { AuthRequest } from '../middleware/auth';

const authService = new AuthService();
const triggerService = new TriggerService();

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);

    // Create default triggers for new user
    await triggerService.createDefaultTriggers(result.user.userId);

    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'User already exists') {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json(result);
  } catch (error: any) {
    if (error.message === 'Invalid credentials' || error.message === 'Account is deactivated') {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Login failed' });
    }
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: 'Both old and new passwords are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters' });
      return;
    }

    await authService.updatePassword(req.user.userId, oldPassword, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    if (error.message === 'Invalid current password') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update password' });
    }
  }
};

export const deactivateAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await authService.deactivateAccount(req.user.userId);
    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate account' });
  }
};
