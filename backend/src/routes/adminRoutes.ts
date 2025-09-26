import { Router } from 'express';
import {
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  loginAdmin,
  updateAdminRole,
  updateAdminStatus,
} from '../controllers/adminController';

const router = Router();

router.post('/', createAdmin);
router.get('/', getAllAdmins);
router.post('/login', loginAdmin);
router.put("/:id/status", updateAdminStatus);
router.delete("/:id", deleteAdmin);
router.put("/:id/role", updateAdminRole);

export default router;