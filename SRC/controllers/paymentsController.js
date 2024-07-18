
import paystack from '../utils/payment.js';

export const initiatePayment = async (req, res) => {
  const { email, amount } = req.body;

  try {
    const paymentData = {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
    };

    const transaction = await paystack.initTransaction(paymentData);
    res.status(200).json({ message: 'Transaction initialized successfully', data: transaction.data });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating transaction', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { reference } = req.query;

  try {
    const verification = await paystack.verifyTransaction(reference);

    if (verification.data.status === 'success') {
      res.status(200).json({ message: 'Payment verified successfully', data: verification.data });
    } else {
      res.status(400).json({ message: 'Payment verification failed', data: verification.data });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying transaction', error: error.message });
  }
};
