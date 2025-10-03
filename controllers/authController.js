import User from "../models/User.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    console.log("📝 Registration Request:", req.body);
    
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log("❌ Validation failed: Missing fields");
      return res.status(400).json({ 
        message: "Please provide name, email and password" 
      });
    }

    if (password.length < 6) {
      console.log("❌ Validation failed: Password too short");
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ 
        message: "Email already registered" 
      });
    }

    console.log("✅ Validation passed, creating user...");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      favorites: [],
      recentlyPlayed: [],
      isAdmin: false
    });

    const savedUser = await newUser.save();
    console.log("✅ User saved to database:", savedUser._id);

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
    console.log("🔑 Generating JWT token...");
    
    const token = jwt.sign(
      { 
        id: savedUser._id, 
        isAdmin: savedUser.isAdmin 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Token generated successfully");

    // Prepare response
    const response = { 
      success: true,
      token, 
      user: { 
        id: savedUser._id, 
        name: savedUser.name, 
        email: savedUser.email, 
        favorites: savedUser.favorites || [],
        isAdmin: savedUser.isAdmin || false
      } 
    };

    console.log("✅ Sending response:", { ...response, token: "***" });
    
    return res.status(201).json(response);

  } catch (err) {
    console.error("❌ Registration Error:", {
      message: err.message,
      stack: err.stack
    });
    
    return res.status(500).json({ 
      success: false,
      message: "Error registering user", 
      error: err.message 
    });
  }
};

/**
 * @desc   User login
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    console.log("🔐 Login Request:", { email: req.body.email });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("❌ Login validation failed: Missing fields");
      return res.status(400).json({ 
        message: "Please provide email and password" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ 
        message: "Invalid credentials" 
      });
    }

    console.log("✅ Login successful:", email);

    const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
    
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = { 
      success: true,
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        favorites: user.favorites || [],
        isAdmin: user.isAdmin || false
      } 
    };

    return res.json(response);

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    return res.status(500).json({ 
      success: false,
      message: "Error logging in", 
      error: err.message 
    });
  }
};

/**
 * @desc   Admin login
 * @route  POST /api/auth/admin/login
 * @access Public (Admin only)
 */
export const adminLogin = async (req, res) => {
  try {
    console.log("👑 Admin Login Request:", { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide email and password" 
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log("❌ Admin not found:", email);
      return res.status(404).json({ 
        message: "Admin not found" 
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("❌ Invalid admin password for:", email);
      return res.status(400).json({ 
        message: "Invalid credentials" 
      });
    }

    console.log("✅ Admin login successful:", email);

    const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
    
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = { 
      success: true,
      token, 
      admin: { 
        id: admin._id, 
        name: admin.name, 
        email: admin.email, 
        role: admin.role 
      } 
    };

    return res.json(response);

  } catch (err) {
    console.error("❌ Admin Login Error:", err.message);
    return res.status(500).json({ 
      success: false,
      message: "Error logging in as admin", 
      error: err.message 
    });
  }
};