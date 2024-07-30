import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
         unique: true
    },
    salt:{
        type: String,
    }, 
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isFrozen: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date, 

    cloudinary_id: {
        type: String,
        required: false
    },
    
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dtt2xgmiv/image/upload/v1720604536/rwzfrg2n3wz3iewc2lvr.jpg" 
    }
});


const User = mongoose.model('User', userSchema);

export default User;