
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const paystack = {
  secretKey: process.env.PAYSTACK_SECRET_KEY,
  initTransaction: async (data) => {
    try {
      const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
        headers: {
          Authorization: `Bearer ${paystack.secretKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to initialize transaction');
    }
  },
  verifyTransaction: async (reference) => {
    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${paystack.secretKey}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || 'Failed to verify transaction');
    }
  },
};

export default paystack;
