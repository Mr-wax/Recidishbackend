import mongoose from "mongoose";

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
    password: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String,
        required: false
    },
    isAdmin:{
        type:Boolean,
        required:false,
        default:false
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dh57777/image/upload/v1626411111/default_profile_pic_y0q72o.png" 
    }
});

const User = mongoose.model("User", userSchema);
export default User;
