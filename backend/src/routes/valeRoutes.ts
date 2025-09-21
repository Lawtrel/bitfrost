import { Router } from 'express';
import {
  createVale,
  getAllVales,
  getValeById,
  updateVale,
  deleteVale,
} from '../controllers/valeController';

const router = Router();

// Rota para criar um novo vale (POST /api/vales)
router.post('/', createVale);

// Rota para listar todos os vales (GET /api/vales)
router.get('/', getAllVales);

// Rota para buscar um vale por ID (GET /api/vales/algum-id)
router.get('/:id', getValeById);

// Rota para atualizar um vale (PUT /api/vales/algum-id)
router.put('/:id', updateVale);

// Rota para deletar um vale (DELETE /api/vales/algum-id)
router.delete('/:id', deleteVale);

export default router;