const express = require('express');
const bcrypt = require('bcrypt'); // For password comparison
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Install jsonwebtoken (npm install jsonwebtoken)

const router = express.Router();

// User registration (POST)
router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = await User.create(req.body);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// User login (POST)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const payload = { email: user.email }; // Payload for JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate JWT
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router
