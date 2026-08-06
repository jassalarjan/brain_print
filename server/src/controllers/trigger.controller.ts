import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { TriggerService } from '../services/trigger.service';
import { AuthRequest } from '../middleware/auth';

const triggerService = new TriggerService();

export const createTriggerValidation = [
  body('name').trim().notEmpty(),
  body('triggerConditions').isObject(),
  body('responses').isObject(),
  body('priority').optional().isInt({ min: 1, max: 10 })
];

export const createTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const trigger = await triggerService.createTrigger(req.user.userId, req.body);
    res.status(201).json(trigger);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trigger' });
  }
};

export const getTriggers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const triggers = await triggerService.getTriggers(req.user.userId);
    res.json(triggers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch triggers' });
  }
};

export const getTriggerById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { triggerId } = req.params;
    const trigger = await triggerService.getTriggerById(req.user.userId, triggerId);

    if (!trigger) {
      res.status(404).json({ error: 'Trigger not found' });
      return;
    }

    res.json(trigger);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trigger' });
  }
};

export const updateTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { triggerId } = req.params;
    const trigger = await triggerService.updateTrigger(req.user.userId, triggerId, req.body);

    if (!trigger) {
      res.status(404).json({ error: 'Trigger not found' });
      return;
    }

    res.json(trigger);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trigger' });
  }
};

export const toggleTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { triggerId } = req.params;
    const trigger = await triggerService.toggleTrigger(req.user.userId, triggerId);

    if (!trigger) {
      res.status(404).json({ error: 'Trigger not found' });
      return;
    }

    res.json(trigger);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle trigger' });
  }
};

export const deleteTrigger = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { triggerId } = req.params;
    const deleted = await triggerService.deleteTrigger(req.user.userId, triggerId);

    if (!deleted) {
      res.status(404).json({ error: 'Trigger not found' });
      return;
    }

    res.json({ message: 'Trigger deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trigger' });
  }
};
