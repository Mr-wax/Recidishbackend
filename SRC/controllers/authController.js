import jwt from "jsonwebtoken";
import crypto from 'crypto';
import User from '../models/UserModel.js';
import { signUpValidator, signInValidator } from "../validators/authValidator.js";
import  {formatZodError } from '../utils/errorMessage.js';
import  generateTokenAndSetCookie  from '../utils/genTokenAndSetCookies.js';
import { sendEmail } from '../utils/mailer.js';

function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}


function comparePasswords(inputPassword, hashedPassword) {
    return hashValue(inputPassword) === hashedPassword;
}


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const resetToken = generateTokenAndSetCookie(user._id, res);

    console.log('Generated reset token:', resetToken);

    
    const resetUrl = `${req.protocol}:https://recidishbackend.onrender.com/api/user/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    await sendEmail(user.email, 'Password Reset Token', message);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const resetToken = req.params.resetToken;
  const { password } = req.body;

  try {
    if (!resetToken || !password) {
      return res.status(400).json({ message: 'Reset token and password are required' });
    }

    
    const decoded = jwt.verify(resetToken, JWT_SECRET);

    
    console.log('Decoded reset token:', decoded);

    const user = await User.findById(decoded.userId);

    console.log('User found:', user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

  
  

export const signUp = async (req, res) => {
    const registerResults = signUpValidator.safeParse(req.body);
    if (!registerResults.success) {
      return res.status(400).json(formatZodError(registerResults.error.issues));
    }
  
    try {
      const { name, email, password } = req.body;
  
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists', user: existingUser });
      }
  
      const newUser = new User({ name, email, password });
  
      await newUser.save();
  
      res.status(200).json({ message: 'User registered successfully', newUser });
      console.log('User registered successfully', newUser);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
      console.log('INTERNAL SERVER ERROR', error.message);
    }
  };
  
  export const signIn = async (req, res) => {
    const loginResults = signInValidator.safeParse(req.body);
    if (!loginResults.success) {
      return res.status(400).json(formatZodError(loginResults.error.issues));
    }
  
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
  
      const accessToken = generateTokenAndSetCookie(user._id, res);
  
      res.status(200).json({ message: 'User logged in successfully', accessToken });
      console.log('User logged in successfully', user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
      console.log('INTERNAL SERVER ERROR', error.message);
    }
  };