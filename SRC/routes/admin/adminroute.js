import express from 'express';
import seedAdmin from '../../seeder/adminseeder.js';

const router = express.Router();

router.post('/seed-admin', seedAdmin);

export default router;
