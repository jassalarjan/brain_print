import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';

const router = Router();

router.post('/save', (req, res) => profileController.save(req, res));
router.get('/:id', (req, res) => profileController.getById(req, res));

export default router;