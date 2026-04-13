const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if users already exist
    const adminExists = await User.findOne({ email: 'mahi@admin.com' });
    const userExists = await User.findOne({ email: 'mahi@user.com' });

    if (adminExists) {
      console.log('Admin already exists!');
    } else {
      // Create Admin
      const admin = await User.create({
        name: 'Mahi Admin',
        email: 'mahi@admin.com',
        password: 'Mahi@2026',
        role: 'admin'
      });
      console.log('✅ Admin created:', admin.email);
    }

    if (userExists) {
      console.log('User already exists!');
    } else {
      // Create User
      const user = await User.create({
        name: 'Mahi User',
        email: 'mahi@user.com',
        password: 'Mahi@2026',
        role: 'user'
      });
      console.log('✅ User created:', user.email);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: mahi@admin.com');
    console.log('  Password: Mahi@2026');
    console.log('  Role: admin');
    console.log('\nUser:');
    console.log('  Email: mahi@user.com');
    console.log('  Password: Mahi@2026');
    console.log('  Role: user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
