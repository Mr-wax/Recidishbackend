import express from 'express';
import seedAdmin from '../../seeder/adminseeder.js';
import { adminSignIn } from '../../controllers/adminController.js';

const router = express.Router();
router.post('/adminlogin', adminSignIn);
router.post('/seed-admin', seedAdmin);

export default router;
