const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');

const SECRET = process.env.JWT_SECRET || 'secret';

// Register a new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  createUser(username, hashedPassword, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
};

// Log in an existing user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    // Fetch user by username
    findUserByUsername(username, async (err, user) => {
      if (err || !user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      try {
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
  
        // Generate token
        const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
      } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Server error. Please try again." });
      }
    });
  };
  
module.exports = { registerUser, loginUser };
