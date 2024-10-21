const User = require("../model/user"); // Import the User model

class CreateUserProfile {
  // Update Profile
  async CreateProfile(req, res) {
    try {
      const { username, bio,email } = req.body;
      console.log(req.file.filename);
      const profileImg = req.file ? `${req.file.filename}` : null; // Save only the relative path


      console.log('Received data:', { username, bio, profileImg });

      // Find the existing user by their username (or use another unique field like email)
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's bio and profile image
      user.username=username;
      user.bio = bio || user.bio;
      if (profileImg) {
        user.profile = profileImg; // Update the profile image if provided
      }

      // Save the updated user to the database
      await user.save();

      return res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
      console.error('Profile update error:', err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async getProfile(req, res) {
    try {
      const { email } = req.params; // Assuming email is passed as a URL parameter

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the user's profile information
      const userProfile = {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profile: user.profile,
        role: user.role,
        blockedUsers: user.blockedUsers, // Optional: include blocked users if necessary
      };

      return res.status(200).json({ message: 'Profile retrieved successfully', userProfile });
    } catch (err) {
      console.error('Error retrieving profile:', err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new CreateUserProfile();
