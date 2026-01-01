const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const playerRoutes = require("./routes/player.routes");

const app = express();

/* ==================== CORS (FIXED) ==================== */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, Railway health checks
      if (!origin) return callback(null, true);

      // Allow localhost (dev)
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Allow ALL Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error("CORS blocked"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//  VERY IMPORTANT: handle preflight
app.options("*", cors());

/* ==================== MIDDLEWARE ==================== */
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==================== ROUTES ==================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/player", playerRoutes);

/* ==================== HEALTH ==================== */
app.get("/api/health", (req, res) => {
  res.status(200).json({
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

/* ==================== 404 ==================== */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ==================== ERROR HANDLER ==================== */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);

  //  IMPORTANT: still send CORS headers on error
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");

  res.status(500).json({
    error: "Internal Server Error",
  });
});

/* ==================== START ==================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
