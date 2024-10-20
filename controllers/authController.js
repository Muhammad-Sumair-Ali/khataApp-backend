const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Efficient query with indexing
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token efficiently
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err); // Log detailed error
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check for existing user
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create and save the new user efficiently
    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err); // Log detailed error
    return res.status(500).json({ error: 'Server error' });
  }
};
