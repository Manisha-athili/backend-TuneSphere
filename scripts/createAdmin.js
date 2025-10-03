import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@tunesphere.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    // Create admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Admin({
      name: 'Admin',
      email: 'admin@tunesphere.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('Email: admin@tunesphere.com');
    console.log('Password: admin123');
    console.log('⚠️ Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();