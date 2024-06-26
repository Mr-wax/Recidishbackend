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

    Email: {
        type: String,
        required: true,
        unique: true
    },

    PhoneNumber: {
        type: Number,
        required: true,
        unique: true
    },

    Password: {
        type: String,
        required: true,
    },
})

const User = mongoose.model("User", userSchema);
export default User;
