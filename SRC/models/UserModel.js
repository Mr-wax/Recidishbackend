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
    resetPasswordExpires: Number, 

    cloudinary_id: {
        type: String,
        required: false
    },
    
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dtt2xgmiv/image/upload/v1720604536/rwzfrg2n3wz3iewc2lvr.jpg" 
    }
});

// Method to hash password
userSchema.methods.hashPassword = function(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Middleware to hash password before saving
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  next();
});

// Method to compare passwords
userSchema.methods.validatePassword = function(password) {
  const hashedPassword = this.hashPassword(password);
  return this.password === hashedPassword;
};

const User = mongoose.model('User', userSchema);

export default User;
