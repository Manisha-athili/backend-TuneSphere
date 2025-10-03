

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";


dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Request logger middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body ? req.body : '');
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend Running ✅", 
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const dbStatus = mongoose.default.connection.readyState;
    
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.json({
      status: "OK",
      database: statusMap[dbStatus],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error.message
    });
  }
});



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || "Internal Server Error", 
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  console.log("❌ 404 Not Found:", req.path);
  res.status(404).json({ 
    success: false,
    message: "Route not found",
    path: req.path 
  });
});

// Connect to Database and Start Server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected");
    
    // Start Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log("\n" + "=".repeat(50));
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🌐 Network: http://192.168.1.16:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log("=".repeat(50) + "\n");
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

// Start the server
startServer();