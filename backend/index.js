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

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow frontend
  credentials: true
}));

app.use(express.json({ limit: "10mb" })); // Support larger file uploads (photos)

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== ROUTES ====================
// All API routes under /api
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/player", playerRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend is running!", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "SITCA 2025 Backend API", version: "1.0.0" });
});

// ==================== ERROR HANDLING ====================
// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});