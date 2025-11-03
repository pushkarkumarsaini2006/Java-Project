import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "leafstack-secret-key-2025";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken: RequestHandler = (req: any, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin: RequestHandler = (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

export const requireAuth: RequestHandler = (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};