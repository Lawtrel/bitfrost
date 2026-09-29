import { Router } from 'express';
import { requireAdmin } from '../auth/middleware';
import {
  createTransportadora,
  getAllTransportadoras,
  deleteTransportadora,
} from '../controllers/transportadoraController';

const router = Router();

router.post('/', requireAdmin, createTransportadora);
router.get('/', getAllTransportadoras);
router.delete('/:id', requireAdmin, deleteTransportadora);

export default router;
