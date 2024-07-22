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

userSchema.pre('save', function (next) {
    const user = this;
  
    if (!user.isModified('password')) {
      return next();
    }
  
    crypto.randomBytes(16, (err, buf) => {
      if (err) return next(err);
      user.salt = buf.toString('hex');
  
      crypto.pbkdf2(user.password, user.salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) return next(err);
        user.password = derivedKey.toString('hex');
        next();
      });
    });
  });

  userSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.password === hash;
  };
  
  const User = mongoose.model('User', userSchema);
  
  export default User ;
