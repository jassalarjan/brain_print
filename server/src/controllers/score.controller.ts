import { Request, Response } from 'express';
import { scoringService } from '../services/scoring.service';
import { ScoreRequest } from '../types';

export class ScoreController {
  calculateScore(req: Request, res: Response) {
    try {
      const { answers }: ScoreRequest = req.body;

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid answers format. Expected array of answers.' 
        });
      }

      // Calculate scores
      const scores = scoringService.calculateScores(answers);
      const correlations = scoringService.calculateCorrelations(scores);

      res.json({ 
        success: true, 
        data: { scores, correlations } 
      });
    } catch (error) {
      console.error('Error calculating scores:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to calculate scores' 
      });
    }
  }
}

export const scoreController = new ScoreController();