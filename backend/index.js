// backend/src/index.js (or server.js)
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const playerRoutes = require("./routes/player.routes");

const app = express();

/* ==================== CORS CONFIG (CRITICAL) ==================== */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, Postman, curl, etc.
    if (!origin) return callback(null, true);

    // Allow localhost and ALL Vercel preview/production URLs
    if (
      origin.startsWith("http://localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS BEFORE everything else
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

/* ==================== MIDDLEWARE ==================== */
app.use(express.json({ limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==================== ROUTES ==================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/player", playerRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "SITCA 2025 Backend API",
    version: "1.0.0",
  });
});

/* ==================== ERROR HANDLING ==================== */
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(500).json({ error: err.message || "Server error" });
});

/* ==================== START SERVER ==================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
