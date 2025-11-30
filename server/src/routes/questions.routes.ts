import { Router } from 'express';
import { questionsController } from '../controllers/questions.controller';

const router = Router();

router.get('/', (req, res) => questionsController.getAll(req, res));

export default router;