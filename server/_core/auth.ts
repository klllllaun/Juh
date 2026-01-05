import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import * as bcrypt from "bcrypt";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";

const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret || "your-secret-key");

export interface AuthPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create JWT token
 */
export async function createJWT(userId: number, email: string): Promise<string> {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify JWT token
 */
export async function verifyJWT(token: string): Promise<AuthPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as AuthPayload;
  } catch (error) {
    console.error("[Auth] JWT verification failed:", error);
    return null;
  }
}

/**
 * Register authentication routes
 */
export function registerAuthRoutes(app: Express) {
  /**
   * POST /api/auth/signup
   * Register a new user
   */
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters" });
        return;
      }

      // Check if user already exists
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      await db.createUser(email, passwordHash, name);
      const user = await db.getUserByEmail(email);

      if (!user) {
        res.status(500).json({ error: "Failed to create user" });
        return;
      }

      // Create JWT token
      const token = await createJWT(user.id, user.email);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("[Auth] Signup failed:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  /**
   * POST /api/auth/login
   * Login with email and password
   */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Get user
      const user = await db.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Create JWT token
      const token = await createJWT(user.id, user.email);

      // Set cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  /**
   * POST /api/auth/logout
   * Logout user
   */
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
}
