import mongoose from 'mongoose';
import crytoHash from 'crypto';
import  authenticateToken  from '../middlewares/roleBasedAccess.js';

// Load your User model
const User = require('./models/user'); // Adjust the path as necessary

// Connect to your MongoDB database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Define the admin user
const adminUser = {
    username: 'admin',
    email: 'admin@example.com',
    password: crypto.createHash('sha256').update('adminpassword').digest('hex'),
    role: 'admin', // Assuming you have a role field to distinguish admin users
};

// Insert the admin user
const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const newAdmin = new User(adminUser);
            await newAdmin.save();
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();
