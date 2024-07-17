import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        // unique: true
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
    isAdmin:{
        type:Boolean,
        required:false,
        default:false
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dtt2xgmiv/image/upload/v1720604536/rwzfrg2n3wz3iewc2lvr.jpg" 
    }
});

const User = mongoose.model("User", userSchema);
export default User;
