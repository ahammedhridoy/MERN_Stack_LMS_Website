import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import { educatorRouter } from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import { cloudinaryConfig } from "./configs/cloudinary.js";
import { courseRouter } from "./routes/courseRoute.js";
import { userRouter } from "./routes/userRoutes.js";

// Initialize app
const app = express();

// Database & Cloudinary Connection
await connectDB();
await cloudinaryConfig();

// Security Headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS Configuration
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// General API Rate Limiting (200 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// Stripe Webhook MUST be placed before express.json() to preserve raw Buffer for signature verification
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// JSON body parser & Clerk Middleware
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Eduka LMS Backend!");
});

// Clerk Webhooks
app.post("/clerk", express.json(), clerkWebhooks);

// API Endpoints with Rate Limiting
app.use("/api/educator", apiLimiter, educatorRouter);
app.use("/api/course", apiLimiter, courseRouter);
app.use("/api/user", apiLimiter, userRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred.",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
