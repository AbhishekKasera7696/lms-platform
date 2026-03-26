const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testUserModel() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing test user
    await User.deleteOne({ email: 'test@example.com' });
    
    // Create new user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await user.save();
    console.log('User created successfully!');
    console.log('User ID:', user._id);
    console.log('Password hash:', user.password);
    
    // Test password comparison
    const isMatch = await user.matchPassword('password123');
    console.log('Password match test:', isMatch);
    
    await mongoose.disconnect();
    console.log('✅ Test completed!');
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
}

testUserModel();