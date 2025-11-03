import { RequestHandler } from "express";
import connectDB from "../config/database";
import { Book, Borrow, User, IBook, IBorrow } from "../models";
import mongoose from "mongoose";

// Types
export interface BookData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  description?: string;
}

export interface BorrowData {
  bookId: string;
  userId: string;
  userName: string;
}

// Book endpoints
export const getBooks: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const books = await Book.find().sort({ createdAt: -1 });
    
    // Transform MongoDB documents to match frontend interface
    const transformedBooks = books.map(book => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      copies: book.copies,
      available: book.available,
      description: book.description,
      addedAt: book.createdAt.toISOString(),
    }));
    
    res.json(transformedBooks);
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addBook: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { title, author, isbn, category, copies, description } = req.body;
    
    if (!title || !author || !isbn || !category || !copies) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(409).json({ error: "Book with this ISBN already exists" });
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      copies: parseInt(copies),
      available: parseInt(copies),
      description,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Add book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBook: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const updates = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBook: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    // Check if book has active borrows
    const activeBorrows = await Borrow.findOne({ bookId: id, returnedAt: { $exists: false } });
    if (activeBorrows) {
      return res.status(400).json({ error: "Cannot delete book with active borrows" });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User endpoints (members and admins)
export const getMembers: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const members = await User.find({ role: 'member' }).sort({ createdAt: -1 });
    
    // Map the data to include joinedAt field
    const membersWithJoinedAt = members.map(member => ({
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      joinedAt: member.createdAt.toISOString(),
    }));
    
    res.json(membersWithJoinedAt);
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMember: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { name, email, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Create a default password for the new member (they should change it on first login)
    const defaultPassword = 'password123'; // This should be hashed in a real app
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'member',
      phone,
    });

    await newUser.save();
    
    // Return user data without password
    const userResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      joinedAt: newUser.createdAt.toISOString(),
    };
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMember: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find the user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has any active borrows
    const activeBorrows = await Borrow.find({ 
      userId: id, 
      returnedAt: { $exists: false } 
    });
    
    if (activeBorrows.length > 0) {
      return res.status(400).json({ 
        error: "Cannot delete user with active borrows. Please return all books first." 
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    
    // Delete all borrow history for this user
    await Borrow.deleteMany({ userId: id });

    res.json({ message: "User and associated borrow history deleted successfully" });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Borrow endpoints
export const getLoans: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { memberId } = req.query;
    
    let query = {};
    if (memberId) {
      if (!mongoose.Types.ObjectId.isValid(memberId as string)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      query = { userId: memberId };
    }
    
    const borrows = await Borrow.find(query).sort({ createdAt: -1 });

    // Update overdue status and transform data
    const now = new Date();
    const transformedBorrows = borrows.map(borrow => {
      const isOverdue = !borrow.returnedAt && new Date(borrow.dueDate) < now;
      
      return {
        id: borrow._id.toString(),
        bookId: borrow.bookId.toString(),
        bookTitle: borrow.bookTitle,
        userId: borrow.userId.toString(),
        userName: borrow.userName,
        borrowedAt: borrow.borrowedAt.toISOString(),
        dueDate: borrow.dueDate.toISOString(),
        returnedAt: borrow.returnedAt?.toISOString(),
        isOverdue,
      };
    });

    res.json(transformedBorrows);
  } catch (error) {
    console.error("Get borrows error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const borrowBook: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { bookId, memberId, memberName } = req.body;
    
    if (!bookId || !memberId || !memberName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    console.log("✅ BookId is valid ObjectId");

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check availability
    if (book.available <= 0) {
      return res.status(400).json({ error: "Book is not available" });
    }

    // Find the user by userId  
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(400).json({ error: "User not found. Please contact admin." });
    }

    // Create borrow record
    const borrowData = {
      bookId: new mongoose.Types.ObjectId(bookId),
      bookTitle: book.title,
      userId: user._id, // Use ObjectId directly, not string
      userName: user.name,
      borrowedAt: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      isOverdue: false,
    };
    
    const borrow = new Borrow(borrowData);

    await borrow.save();

    // Update book availability
    book.available -= 1;
    await book.save();

    // Transform the response to match frontend interface
    const transformedBorrow = {
      id: borrow._id.toString(),
      bookId: borrow.bookId.toString(),
      bookTitle: borrow.bookTitle,
      userId: borrow.userId.toString(),
      userName: borrow.userName,
      borrowedAt: borrow.borrowedAt.toISOString(),
      dueDate: borrow.dueDate.toISOString(),
      returnedAt: borrow.returnedAt?.toISOString(),
      isOverdue: false, // New borrow is not overdue
    };

    res.status(201).json(transformedBorrow);
  } catch (error) {
    console.error("Borrow book error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors,
        message: error.message 
      });
    }
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

export const returnBook: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid borrow ID" });
    }

    const borrow = await Borrow.findById(id);
    if (!borrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }
    
    // Check if already returned
    if (borrow.returnedAt) {
      return res.status(400).json({ error: "Book already returned" });
    }

    // Update borrow record
    borrow.returnedAt = new Date();
    await borrow.save();

    // Update book availability
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }

    // Transform the response to match frontend interface
    const transformedBorrow = {
      id: borrow._id.toString(),
      bookId: borrow.bookId.toString(),
      bookTitle: borrow.bookTitle,
      userId: borrow.userId.toString(),
      userName: borrow.userName,
      borrowedAt: borrow.borrowedAt.toISOString(),
      dueDate: borrow.dueDate.toISOString(),
      returnedAt: borrow.returnedAt?.toISOString(),
      isOverdue: false, // No longer overdue since it's returned
    };

    res.json(transformedBorrow);
  } catch (error) {
    console.error("Return book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to ensure user has member role (no longer needed with unified User model)
export const addMemberFromAuth = async (userData: { id: string; name: string; email: string }) => {
  try {
    await connectDB();
    // Since we now use a unified User model, just return the user data
    // The User already exists from registration with role 'member'
    const user = await User.findById(userData.id);
    return user;
  } catch (error) {
    console.error("Get user from auth error:", error);
    throw error;
  }
};