import mongoose from 'mongoose';
import User from '../models/UserModel.js'; 
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin user already exists' });
        }

        const adminUser = new User({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD, 
            role: 'admin',
        });

        await adminUser.save();

        res.status(201).json({ message: 'Admin user created successfully', adminUser });
    } catch (error) {
        console.error('Error seeding admin user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export default seedAdmin;
