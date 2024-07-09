import crypto from 'crypto';
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

// Controller for user registration (sign-up)
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
