const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      minlength: 3, 
      maxlength: 20,
      unique: true,  
      default: null 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true // For faster search
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    profile: {
      type: String, 
      default: null 
    },
    bio: {
      type: String,
      maxlength: 160, 
      default: null 
    },
    blockedUsers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ], // Array of blocked users
  },
  { timestamps: true } // Automatically include createdAt and updatedAt fields
);

const UserModel = mongoose.model("User", UserSchema); // Model name should be capitalized

module.exports = UserModel;
