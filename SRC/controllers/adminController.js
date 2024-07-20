import User from '../models/UserModel.js';
import generateTokenAndSetCookie from '../utils/genTokenAndSetCookies.js';
import  signInValidator  from '../validators/authValidator.js';
import  formatZodError  from '../utils/errorMessage.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.remove();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const deleteAllUsers = async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: 'All users removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const adminSignIn = async (req, res) => {
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

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, not admin' });
        }

        // Generate access token
        const accessToken = generateTokenAndSetCookie(user._id, res);

        res.status(200).json({ message: 'Admin logged in successfully', accessToken });
        console.log('Admin logged in successfully', user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        console.log('INTERNAL SERVER ERROR', error.message);
    }
};
