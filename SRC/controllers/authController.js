import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { sendEmail } from '../utils/mailer.js';
import  generateTokenAndSetCookie  from '../utils/genTokenAndSetCookies.js';
import { signInValidator,signUpValidator, passwordValidator } from '../validators/authValidator.js';

function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token and expiration
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = Date.now() + 7200000; 

        // Update user with reset token and expiration
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        console.log('Generated reset token:', resetToken);
        console.log('Reset token expiration:', new Date(resetPasswordExpires));

        const resetUrl = `${req.protocol}://https://recipe-hub-indol.vercel.app/reset/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link to reset your password: \n\n ${resetUrl}`;
        await sendEmail(user.email, 'Password Reset Token', message);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const resetPassword = async (req, res) => {
  const { passwordtoken, password } = req.body;

  try {
    console.log('Received reset token:', passwordtoken);

    // Validate the new password
    const validation = passwordValidator.safeParse(password);

    if (!validation.success) {
      return res.status(400).json(formatZodError(validation.error.issues));
    }

    const user = await User.findOne({
      resetPasswordToken: passwordtoken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('Token is invalid or has expired');
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    console.log('User found:', user);

    // Hash the new password before saving it
    const hashedPassword = hashValue(password);
    console.log('New hashed password:', password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    console.log('User after saving new password:', user);

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
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

    // Validate the hashed password
    const isPasswordValid = user.validatePassword(password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const accessToken = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({ message: 'User logged in successfully', accessToken, user });
    console.log('User logged in successfully', user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
    console.log('INTERNAL SERVER ERROR', error.message);
  }
};

  export const logout = (req, res) => {
    res.clearCookie('token'); 
    res.status(200).json({ message: 'User logged out successfully' });
  };