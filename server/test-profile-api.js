const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config();

// Connect to MongoDB and create a test token
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker')
  .then(async () => {
    const User = require('./models/User');
    const user = await User.findOne({ email: 'kamrul@gmail.com' });
    if (user) {
      // Create a token for testing
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', { expiresIn: '14d' });
      
      console.log('User ID:', user._id);
      console.log('Token created:', token.substring(0, 20) + '...');
      
      // Test the API endpoint using native http module
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/users/' + user._id,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log('✅ API Response (Status ' + res.statusCode + '):', data);
          process.exit(0);
        });
      });

      req.on('error', (err) => {
        console.log('❌ API Error:', err.message);
        process.exit(1);
      });

      req.end();
    } else {
      console.log('User not found');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
