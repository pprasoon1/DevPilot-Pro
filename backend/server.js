const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const authenticate = require("./middleware/auth");
const projectRoutes = require("./routes/projects");

const path = require("path");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "*",
  })
); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/eduProjects', require('./routes/eduProjects'));
app.use('/api/evaluate', require('./routes/evaluate'));

// Example protected route
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.userId });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
