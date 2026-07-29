require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDB = require("./config/db");


const quizRoutes = require("./routes/questionroutes");
const authRoutes = require("./routes/authroutes");
const resultRoutes = require("./routes/resultroutes");
const teamRoutes = require("./routes/teamroutes"); 
const adminRoutes = require("./routes/adminroutes");  // <-- Add this

const app = express();
const PORT = process.env.PORT || 3000;

// Connect MongoDB
connectDB();

console.log("MONGO_URI =", process.env.MONGO_URI);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/questions", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/teams", teamRoutes);  
app.use("/api/admin", adminRoutes);  // <-- Add this

// Serve frontend
app.use(express.static(path.join(__dirname, "../client")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 BugWar Server Running at http://localhost:${PORT}`);
});

