import { Router } from 'express';
import { requireAuth, requireAdmin } from '../auth/middleware';
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
router.post('/login', loginAdmin);
router.get('/me', requireAuth, (_req, res) => res.json(res.locals.user));
router.use(requireAuth, requireAdmin);
router.get('/', getAllAdmins);
router.put("/:id/status", updateAdminStatus);
router.delete("/:id", deleteAdmin);
router.put("/:id/role", updateAdminRole);

export default router;
