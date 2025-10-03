import jwt from "jsonwebtoken";

/**
 * Verify JWT Token
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log("❌ No authorization header");
      return res.status(401).json({ 
        success: false,
        message: "No authorization header provided" 
      });
    }

    // Check if it starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      console.log("❌ Invalid authorization format");
      return res.status(401).json({ 
        success: false,
        message: "Invalid authorization format. Use: Bearer <token>" 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user ID to request
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin || false;
    
    console.log("✅ Token verified for user:", req.userId);
    
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: "Token verification failed",
      error: error.message 
    });
  }
};

/**
 * Verify Admin
 */
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.isAdmin) {
      console.log("❌ User is not admin:", req.userId);
      return res.status(403).json({ 
        success: false,
        message: "Admin access required" 
      });
    }
    
    console.log("✅ Admin verified:", req.userId);
    next();
  } catch (error) {
    console.error("❌ Admin verification failed:", error.message);
    return res.status(500).json({ 
      success: false,
      message: "Error verifying admin status",
      error: error.message 
    });
  }
};