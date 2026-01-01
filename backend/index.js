const express = require("express");
const path = require("path");
const cors = require("cors"); // Add CORS package
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const playerRoutes = require("./routes/player.routes");

const app = express();

/* ===== IMPROVED CORS CONFIGURATION ===== */
// Option 1: Using the cors package (recommended)
app.use(cors({
  origin: [
    'https://sitca-project-plu0p2mxw-nikhil-guddakars-projects.vercel.app',
    'http://localhost:5173', // If you have local frontend
    'http://localhost:3000'
  ],
  credentials: true, // If you're using cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Option 2: Manual CORS (if you don't want to use cors package)
/*
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://sitca-project-plu0p2mxw-nikhil-guddakars-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
*/

/* ===== MIDDLEWARE ===== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ===== START ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});