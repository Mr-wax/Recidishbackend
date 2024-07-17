import express from "express";
const router = express.Router()
 import {signUp, signIn} from "../../controllers/authController.js";
 import { forgotPassword, resetPassword } from "../../controllers/authController.js";

router.post("/register", signUp)
router.post("/login", signIn)

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export default router;