const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
    expiresIn: '30d'
  });
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, age, weight } = req.body;

    console.log('📝 Registration attempt:', { name, email, password: '***' });

    // Validate email domain
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!validDomains.includes(domain)) {
      return res.status(400).json({ message: 'Please use a valid email provider (Gmail, Yahoo, Outlook, Hotmail, or iCloud)' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      age,
      weight,
      isAdmin: email.toLowerCase() === 'enid.hasan.21@gmail.com'
    });

    console.log('💾 Saving user to MongoDB...');
    const savedUser = await user.save();
    console.log('✅ User saved successfully:', savedUser._id);

    // Generate token
    const token = generateToken(savedUser._id);

    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      age: savedUser.age,
      weight: savedUser.weight,
      isAdmin: savedUser.isAdmin,
      createdAt: savedUser.createdAt,
      token
    });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password (plain text comparison)
    const isPasswordValid = user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    // Use the authenticated user's ID from the token
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const { name, email, age, weight, currentPassword, newPassword } = req.body;
    
    // Use the authenticated user's ID from the token
    const userId = req.user._id;
    
    console.log('📝 Update user request for ID:', userId);
    console.log('📝 Update data:', { name, email, age, weight, hasNewPassword: !!newPassword });
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // If changing password, verify current password (plain text)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      
      const isPasswordValid = user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      
      user.password = newPassword;
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (age !== undefined) user.age = age;
    if (weight !== undefined) user.weight = weight;

    const updatedUser = await user.save();
    
    console.log('✅ User updated successfully');

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      weight: updatedUser.weight,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt
    });
  } catch (err) {
    console.error('❌ Update user error:', err);
    res.status(400).json({ message: err.message });
  }
};
