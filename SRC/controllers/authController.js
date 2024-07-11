import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/UserModel.js';
import { signUpValidator, signInValidator } from "../validators/authValidator.js";
import { formatZodError } from '../utils/errorMessage.js';
import generateTokenAndSetCookie from '../utils/genTokenAndSetCookies.js';

// Function to hash a value using SHA-256
function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

// Function to compare passwords
function comparePasswords(inputPassword, hashedPassword) {
    return hashValue(inputPassword) === hashedPassword;
}

// Function to send an email
async function sendEmail({ to, subject, text }) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your email password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
}

// Controller for forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();

        const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                ${resetUrl}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Controller for reset password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        user.password = hashValue(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Existing sign-up and sign-in functions...

export const signUp = async (req, res) => {
    const registerResults = signUpValidator.safeParse(req.body);
    if (!registerResults.success) {
        return res.status(400).json(formatZodError(registerResults.error.issues));
    }

    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists', user: existingUser });
        }

        // Hash the password
        const encryptedPassword = hashValue(password);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: encryptedPassword
        });

        await newUser.save();

        res.status(200).json({ message: 'User registered successfully', newUser });
        console.log('User registered successfully', newUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        console.log('INTERNAL SERVER ERROR', error.message);
    }
};

// Controller for user login (sign-in)
export const signIn = async (req, res) => {
    const loginResults = signInValidator.safeParse(req.body);
    if (!loginResults.success) {
        return res.status(400).json(formatZodError(loginResults.error.issues));
    }

    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = comparePasswords(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate access token
        const accessToken = generateTokenAndSetCookie(user._id, res);

        res.status(200).json({ message: 'User logged in successfully', accessToken });
        console.log('User logged in successfully', user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        console.log('INTERNAL SERVER ERROR', error.message);
    }
};
