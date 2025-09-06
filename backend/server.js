import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import { educatorRouter } from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import { cloudinaryConfig } from "./configs/cloudinary.js";
import { courseRouter } from "./routes/courseRoute.js";

// Initialize app
const app = express();

// Database
await connectDB();
await cloudinaryConfig();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
