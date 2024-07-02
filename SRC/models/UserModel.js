import { generateKey } from "crypto";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        maxlength:500
    },
    gender:{
        type:String,
        enum:['male','female','Male','Female'],
        required:true,
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dh57777/image/upload/v1626411111/default_profile_pic_y0q72o.png" 
    }
})

const User = mongoose.model("User", userSchema);
export default User;
