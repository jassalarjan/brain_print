import { Router } from 'express';
import { scoreController } from '../controllers/score.controller';

const router = Router();

router.post('/', (req, res) => scoreController.calculateScore(req, res));

export default router;