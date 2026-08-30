import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import routes from "./routes/index.js";
import process from "process";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount API routes under /api
app.use("/api", routes);

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "ShoppyGlobe API is running 🚀" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, _req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start server after DB connection
connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shoppyglobe").then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
