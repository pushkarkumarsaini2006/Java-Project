import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "../config/database";
import { User } from "../models";
import { addMemberFromAuth } from "./library";

const JWT_SECRET = process.env.JWT_SECRET || "leafstack-secret-key-2025";

export const login: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verify: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const register: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const { username, name, email, password, role = "member" } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ error: "Username, name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    await user.save();

    // No longer need to add to members collection since Users serve both purposes

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};