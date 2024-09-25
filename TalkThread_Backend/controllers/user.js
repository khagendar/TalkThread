const model = require("../model/user");
const bcrypt = require('bcrypt');
const auth = require('./auth'); // Assuming you have a file for authentication utilities

class LoginController {
  // Sign Up
  async signup(req, res) {
    const { name, email, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = await model.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await model.create({ name, email, password: hashedPassword, role: "user" });

      // Generate JWT token
      const token = auth.token(newUser);
      
      // Send response
      res.status(201).json({ message: 'User created successfully', user: newUser, token });
    } catch (error) {
      console.error('Error during sign-up:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Sign In
  async signin(req, res) {
    const { email, password } = req.body;
    try {
      // Find the user
      const user = await model.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      // Generate JWT token
      const token = auth.token(user);
      
      // Send response
      res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
      console.error('Error during sign-in:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new LoginController();
