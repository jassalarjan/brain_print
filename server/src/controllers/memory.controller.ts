import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { MemoryService } from '../services/memory.service';
import { SentimentService } from '../services/sentiment.service';
import { AuthRequest } from '../middleware/auth';

const memoryService = new MemoryService();
const sentimentService = new SentimentService();

export const createMemoryValidation = [
  body('content').trim().notEmpty(),
  body('type').isIn(['note', 'quote', 'memory']),
  body('tags').optional().isArray(),
  body('metadata').optional().isObject()
];

export const createMemory = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { content, type, tags, metadata } = req.body;

    // Auto-detect sentiment if not provided
    const sentiment = sentimentService.analyzeSentiment(content);

    const memory = await memoryService.createMemory(req.user.userId, {
      content,
      type,
      tags,
      sentiment: sentiment.sentiment,
      metadata
    });

    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create memory' });
  }
};

export const getMemories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { type, tags, sentiment, limit } = req.query;

    const filters: any = {};
    if (type) filters.type = type as string;
    if (tags) filters.tags = (tags as string).split(',');
    if (sentiment) filters.sentiment = sentiment as string;
    if (limit) filters.limit = parseInt(limit as string);

    const memories = await memoryService.getMemories(req.user.userId, filters);
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
};

export const searchMemories = async (req: AuthRequest, res: Response): Promise<void> => {
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
    const memories = await memoryService.searchMemories(req.user.userId, q as string, searchLimit);
    
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getMemoryById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { memoryId } = req.params;
    const memory = await memoryService.getMemoryById(req.user.userId, memoryId);

    if (!memory) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }

    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
};

export const updateMemory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { memoryId } = req.params;
    const updates = req.body;

    // Re-analyze sentiment if content changed
    if (updates.content) {
      const sentiment = sentimentService.analyzeSentiment(updates.content);
      updates.sentiment = sentiment.sentiment;
    }

    const memory = await memoryService.updateMemory(req.user.userId, memoryId, updates);

    if (!memory) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }

    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update memory' });
  }
};

export const deleteMemory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { memoryId } = req.params;
    const deleted = await memoryService.deleteMemory(req.user.userId, memoryId);

    if (!deleted) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }

    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete memory' });
  }
};

export const getMemoriesByTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { tag } = req.params;
    const memories = await memoryService.getMemoriesByTag(req.user.userId, tag);
    
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memories by tag' });
  }
};

export const getMemoriesBySource = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { source } = req.params;
    const memories = await memoryService.getMemoriesBySource(req.user.userId, source);
    
    res.json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memories by source' });
  }
};
