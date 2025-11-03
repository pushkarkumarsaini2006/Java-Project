import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/database';
import { User, Book, Borrow } from '../models';

export async function seedDatabase() {
  try {
    await connectDB();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists - skipping database seeding');
      return;
    }
    
    console.log('🌱 Starting database seeding (first time setup)...');

    // Only clear data if we're doing initial setup
    // Don't clear if we're just adding the missing admin
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.deleteMany({});
      await Book.deleteMany({});
      await Borrow.deleteMany({});
      console.log('🧹 Cleared existing data for fresh setup');
    }

    // Create default admin user only
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      name: 'Library Administrator',
      email: 'admin@leafstack.com',
      password: hashedAdminPassword,
      role: 'admin',
    });

    console.log('✅ Database seeding completed successfully!');
    console.log(`🔐 Created 1 admin user`);
    console.log('👥 No additional users created - fresh start');
    console.log('📚 No sample books created - fresh start');
    console.log('📖 No sample borrows created - fresh start');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}