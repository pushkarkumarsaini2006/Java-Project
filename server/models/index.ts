import mongoose, { Schema, Document } from 'mongoose';

// User Interface and Schema
export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  },
  phone: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Book Interface and Schema
export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  available: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  copies: {
    type: Number,
    required: true,
    min: 1,
  },
  available: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Borrow Interface and Schema (renamed from Loan)
export interface IBorrow extends Document {
  bookId: mongoose.Types.ObjectId;
  bookTitle: string; // Add bookTitle field
  userId: mongoose.Types.ObjectId; // Reference to User instead of Member
  userName: string; // Add userName field
  borrowedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
  isOverdue: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowSchema = new Schema<IBorrow>({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  bookTitle: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference User directly
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  borrowedAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnedAt: {
    type: Date,
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Create indexes for better performance
BookSchema.index({ title: 1, author: 1 });
BorrowSchema.index({ bookId: 1, userId: 1 });
BorrowSchema.index({ returnedAt: 1 });

// Export models with proper handling for development hot reload
export const User = (mongoose.models.User || mongoose.model<IUser>('User', UserSchema)) as mongoose.Model<IUser>;
export const Book = (mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)) as mongoose.Model<IBook>;
export const Borrow = (mongoose.models.Borrow || mongoose.model<IBorrow>('Borrow', BorrowSchema)) as mongoose.Model<IBorrow>;