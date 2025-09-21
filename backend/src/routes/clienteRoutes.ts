import { Router } from 'express';
import {
  createCliente,
  getAllClientes,
  deleteCliente,
} from '../controllers/clienteController';

const router = Router();

router.post('/', createCliente);
router.get('/', getAllClientes);
router.delete('/:id', deleteCliente);

export default router;