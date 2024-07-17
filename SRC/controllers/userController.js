import User from '../models/UserModel.js';
import cryptoHash from "crypto";
import protectRoute from '../middlewares/protectRoute.js';

export const getallUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        if (!allUsers || allUsers.length === 0) {
            return res.status(400).json({message: 'No users found'});
        }
        res.status(200).json({message: 'Users found successfully', data: allUsers});
    } catch (error) {
        console.error('Error while getting all users:', error);
        res.status(500).json({message: error.message});
    }
};


export const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const singleUser = await User.findById(userId);
        
        if (!singleUser) {
            return res.status(404).json({ message: `No user with such id: ${userId} found` });
        }
        
        res.status(200).json({ message: 'User found successfully', data: singleUser });
    } catch (error) {
        console.error('Error while getting single user:', error);
        res.status(500).json({ message: error.message });
    }
};


export const deleteSingleUser = async (req, res) => {
    try { 
        const userId =req.params.id
        const singleUser =await User.findById(userId)
        if (!singleUser) {
            res.status(400).json({message: `No user with such id: ${userId} found`})
        }  else {
            res.status(200).json({message:'User found successfully', singleUser})
        }
    } catch (error) {
        console.error('Error while deleting user:', error);
        res.status(500).json({message: error.message})
    }};

    export const freezeAccount = async(req, res) => {
        try {
            const user = await user.findById(req.user._id)
            if (!user) {
                res.status(401).json({message: "You are unauthorized to freeze this account"})
            }
            user.isFrozen = true
            await user.save()
        } catch (error) {
            res.status(500).json({message:error})
        }
    };

    export const deleteAllUsers = async (req, res) => {
        try {
            const allUsers = await user.deleteMany()
            if (!allUsers) {
                res.status(400).json({message: 'No users found'})
        }   else {
            res.status(200).json({message: 'Users deleted successfuly'})
        }
    } catch (error) {
        console.error('Error while deleting all users:', error);
        res.status(500).json({message: error.message})
    }};
    export const getSuggestedUsers = async (req, res) => {
        try {
            const userId = req.user._id;
    
            const usersFollowedByYou = await User.findById(userId).select("following");
    
            const users = await User.aggregate([
                {
                    $match: {
                        _id: { $ne: userId },
                    },
                },
                {
                    $sample: { size: 10 },
                },
            ]);
            const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
            const suggestedUsers = filteredUsers.slice(0, 4);
    
            suggestedUsers.forEach((user) => (user.password = null));
    
            res.status(200).json(suggestedUsers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    export const updateUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const { password, ...rest } = req.body;
    
            let updatedUser;
    
            if (password) {
                const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
                updatedUser = await User.findByIdAndUpdate(userId, { ...rest, password: hashedPassword }, { new: true });
            } else {
                updatedUser = await User.findByIdAndUpdate(userId, rest, { new: true });
            }
    
            if (!updatedUser) {
                return res.status(404).json({ message: `User with id: ${userId} not found` });
            }
    
            return res.status(200).json({ message: 'User updated successfully', data: updatedUser });
        } catch (error) {
            console.error('Error while updating user:', error);
            res.status(500).json({ message: error.message });
        }
    };
