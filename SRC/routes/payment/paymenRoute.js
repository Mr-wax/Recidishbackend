// paymentRoutes.js
import express from 'express';
import { initiatePayment, verifyPayment } from '../../controllers/paymentsController.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.get('/verify', verifyPayment);

export default router;
