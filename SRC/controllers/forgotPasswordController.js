import bcrypt from 'bcryptjs';
import User from '../models/forgotPasswordModel.js';


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body; // Extract token and new password from request body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
    });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' }); // Invalid or expired token
    }

    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    user.password = await bcrypt.hash(newPassword, salt); // Hash the new password
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the token expiration

    await user.save(); // Save the updated user

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
