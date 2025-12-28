import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import sessionRoutes from "./routes/session.routes.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => res.json({ status: "ok", message: "VauLT Backend API" }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Backend listening on port ${port}`));
