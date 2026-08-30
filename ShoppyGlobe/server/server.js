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

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler — single place all route errors flow into
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Malformed JSON body from express.json()
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }

  // Our typed API errors (thrown by controllers / validation middleware)
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Mongoose: invalid ObjectId / schema validation failures
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Duplicate key (e.g. unique index)
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value", field: Object.keys(err.keyValue || {}) });
  }

  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server after DB connection
connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shoppyglobe").then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
});
