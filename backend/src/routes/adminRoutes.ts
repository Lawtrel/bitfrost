import { Router } from 'express';
import {
  createAdmin,
  getAllAdmins,
} from '../controllers/adminController';

const router = Router();

router.post('/', createAdmin);
router.get('/', getAllAdmins);

export default router;