// backend/src/index.js (or server.js)
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const playerRoutes = require("./routes/player.routes");

const app = express();

/* ==================== CORS (FINAL FIX) ==================== */
/*
  This reflects the request origin automatically.
  Works for:
  - Vercel preview URLs
  - Vercel production
  - localhost
  - Postman / curl
*/
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// REQUIRED for preflight
app.options("*", cors());

/* ==================== MIDDLEWARE ==================== */
app.use(express.json({ limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==================== ROUTES ==================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/player", playerRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

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
  console.error("Server error:", err);
  res.status(500).json({ error: "Server error" });
});

/* ==================== START SERVER ==================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

