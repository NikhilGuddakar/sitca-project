const express = require("express");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const playerRoutes = require("./routes/player.routes");

const app = express();

/* ===== ENHANCED CORS MIDDLEWARE ===== */
// Handle preflight (OPTIONS) requests first
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.status(200).send();
});

// Regular CORS for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // If you need credentials (cookies/sessions), use specific origins
  // const allowedOrigins = ['https://sitca-project-plu0p2mxw-nikhil-guddakars-projects.vercel.app'];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  // res.header('Access-Control-Allow-Credentials', 'true');
  
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

/* ===== ERROR HANDLER ===== */
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ===== START ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});