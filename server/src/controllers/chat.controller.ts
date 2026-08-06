import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AIContextService } from '../services/ai-context.service';
import { AuthRequest } from '../middleware/auth';

const aiContextService = new AIContextService();

export const sendMessageValidation = [
  body('content').trim().notEmpty()
];

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { content } = req.body;
    const result = await aiContextService.processMessage(req.user.userId, content);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { limit } = req.query;
    const historyLimit = limit ? parseInt(limit as string) : 50;

    const messages = await aiContextService.getChatHistory(req.user.userId, historyLimit);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const searchChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { q, limit } = req.query;

    if (!q) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const searchLimit = limit ? parseInt(limit as string) : 20;
    const messages = await aiContextService.searchChatHistory(req.user.userId, q as string, searchLimit);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Chat search failed' });
  }
};
