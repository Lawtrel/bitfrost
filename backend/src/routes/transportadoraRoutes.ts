import { Router } from 'express';
import {
  createTransportadora,
  getAllTransportadoras,
  deleteTransportadora,
} from '../controllers/transportadoraController';

const router = Router();

router.post('/', createTransportadora);
router.get('/', getAllTransportadoras);
router.delete('/:id', deleteTransportadora);

export default router;