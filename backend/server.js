import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
await connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});
app.post("/clerk", express.json(), clerkWebhooks);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
