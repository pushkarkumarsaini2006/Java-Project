import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database";
import { handleDemo } from "./routes/demo";
import { login, verify, register } from "./routes/auth";
import { authenticateToken, requireAdmin, requireAuth } from "./middleware/auth";
import { 
  getBooks, addBook, updateBook, deleteBook,
  getMembers, addMember, deleteMember,
  getLoans, borrowBook, returnBook
} from "./routes/library";

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
    
    // Optional: Seed database with initial data (uncomment if needed)
    const { seedDatabase } = await import("./config/seeder");
    await seedDatabase();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export async function createServer() {
  // Initialize database connection
  await initializeDatabase();
  
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Authentication routes (public)
  app.post("/api/auth/login", login);
  app.get("/api/auth/verify", verify);
  app.post("/api/auth/register", register);

  // Protected routes - require authentication
  app.get("/api/demo", authenticateToken, handleDemo);

  // Library routes
  app.get("/api/books", authenticateToken, getBooks);
  app.post("/api/books", authenticateToken, requireAdmin, addBook);
  app.put("/api/books/:id", authenticateToken, requireAdmin, updateBook);
  app.delete("/api/books/:id", authenticateToken, requireAdmin, deleteBook);
  
  app.get("/api/members", authenticateToken, requireAdmin, getMembers);
  app.post("/api/members", authenticateToken, requireAdmin, addMember);
  app.delete("/api/members/:id", authenticateToken, requireAdmin, deleteMember);
  
  app.get("/api/loans", authenticateToken, getLoans);
  app.post("/api/loans/borrow", authenticateToken, borrowBook);
  app.put("/api/loans/:id/return", authenticateToken, returnBook);

  // Public routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  return app;
}
