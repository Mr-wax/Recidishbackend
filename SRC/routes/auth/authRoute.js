import express from "express";
const router = express.Router()
 import {signUp, signIn} from "../../controllers/authController.js";
 import { forgotPassword, resetPassword } from "../../controllers/authController.js";
 import seedAdmin from "../../seeder/adminseeder.js";

router.post("/register", signUp)
router.post("/login", signIn)

router.post("/loginadmin", seedAdmin)

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export default router;