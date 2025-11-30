import { Request, Response } from 'express';
import { getQuestions } from '../services/questions.service';

export class QuestionsController {
  getAll(req: Request, res: Response) {
    try {
      const questions = getQuestions();
      res.json({ success: true, data: questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch questions' });
    }
  }
}

export const questionsController = new QuestionsController();