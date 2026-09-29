import { Router } from 'express';
import { requireAdmin } from '../auth/middleware';
import {
  createCliente,
  getAllClientes,
  deleteCliente,
} from '../controllers/clienteController';

const router = Router();

router.post('/', requireAdmin, createCliente);
router.get('/', getAllClientes);
router.delete('/:id', requireAdmin, deleteCliente);

export default router;
