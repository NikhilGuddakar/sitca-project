const express = require("express");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const playerRoutes = require("./routes/player.routes");

const app = express();

/* ===== TEMPORARY HARD CORS FIX ===== */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ===== MIDDLEWARE ===== */
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/player", playerRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.get("/", (req, res) => {
  res.json({ message: "SITCA 2025 Backend API" });
});

/* ===== START ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
