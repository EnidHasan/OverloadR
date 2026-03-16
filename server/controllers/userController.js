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
    const { name, email, password, age, weight, weightUnit, heightUnit, heightCm, heightFeet, heightInches, phone, addressLine1, addressLine2, city, state, postalCode, country } = req.body;

    console.log('📝 Registration attempt:', { name, email, password: '***' });

    // Validate email domain
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    // Validate as a plain string first to prevent ReDoS and injection
    if (typeof email !== 'string' || email.length > 254) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{1,63}$/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!validDomains.includes(domain)) {
      return res.status(400).json({ message: 'Please use a valid email provider (Gmail, Yahoo, Outlook, Hotmail, or iCloud)' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: String(email) });
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
      weightUnit,
      heightUnit,
      heightCm,
      heightFeet,
      heightInches,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
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
      weightUnit: savedUser.weightUnit,
      heightUnit: savedUser.heightUnit,
      heightCm: savedUser.heightCm,
      heightFeet: savedUser.heightFeet,
      heightInches: savedUser.heightInches,
      phone: savedUser.phone,
      addressLine1: savedUser.addressLine1,
      addressLine2: savedUser.addressLine2,
      city: savedUser.city,
      state: savedUser.state,
      postalCode: savedUser.postalCode,
      country: savedUser.country,
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

    // Find user by email — cast to string to prevent NoSQL injection
    if (typeof email !== 'string') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = await User.findOne({ email: String(email) });
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
      weightUnit: user.weightUnit,
      heightUnit: user.heightUnit,
      heightCm: user.heightCm,
      heightFeet: user.heightFeet,
      heightInches: user.heightInches,
      phone: user.phone,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      country: user.country,
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
    console.log('📍 GET /users/:id - getUser called');
    console.log('   - User ID from token:', req.user._id);
    console.log('   - Param ID:', req.params.id);
    
    // Use the authenticated user's ID from the token
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      console.log('❌ User not found for ID:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ Returning user data for:', user.email);
    res.json(user);
  } catch (err) {
    console.error('❌ Error in getUser:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      weight,
      weightUnit,
      heightUnit,
      heightCm,
      heightFeet,
      heightInches,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      currentPassword,
      newPassword
    } = req.body;
    
    // Use the authenticated user's ID from the token
    const userId = req.user._id;
    
    console.log('📝 Update user request for ID:', userId);
    console.log('📝 Update data:', { name, email, age, weight, weightUnit, heightUnit, heightCm, heightFeet, heightInches, phone, addressLine1, addressLine2, city, state, postalCode, country, hasNewPassword: !!newPassword });
    
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
    if (weightUnit !== undefined) user.weightUnit = weightUnit;
    if (heightUnit !== undefined) user.heightUnit = heightUnit;
    if (heightCm !== undefined) user.heightCm = heightCm;
    if (heightFeet !== undefined) user.heightFeet = heightFeet;
    if (heightInches !== undefined) user.heightInches = heightInches;
    if (phone !== undefined) user.phone = phone;
    if (addressLine1 !== undefined) user.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) user.addressLine2 = addressLine2;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (postalCode !== undefined) user.postalCode = postalCode;
    if (country !== undefined) user.country = country;

    const updatedUser = await user.save();
    
    console.log('✅ User updated successfully');

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      weight: updatedUser.weight,
      weightUnit: updatedUser.weightUnit,
      heightUnit: updatedUser.heightUnit,
      heightCm: updatedUser.heightCm,
      heightFeet: updatedUser.heightFeet,
      heightInches: updatedUser.heightInches,
      phone: updatedUser.phone,
      addressLine1: updatedUser.addressLine1,
      addressLine2: updatedUser.addressLine2,
      city: updatedUser.city,
      state: updatedUser.state,
      postalCode: updatedUser.postalCode,
      country: updatedUser.country,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt
    });
  } catch (err) {
    console.error('❌ Update user error:', err);
    res.status(400).json({ message: err.message });
  }
};
