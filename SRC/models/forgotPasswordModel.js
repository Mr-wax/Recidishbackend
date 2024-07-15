// models/UserModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // ... other fields
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);
export default User;
