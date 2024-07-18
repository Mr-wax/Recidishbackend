
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);
export default User;
