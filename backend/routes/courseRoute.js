import express from "express";
import {
  getAllCourses,
  getCourseById,
} from "../controllers/courseController.js";

export const courseRouter = express.Router();

courseRouter.get("/all", getAllCourses);
courseRouter.get("/:id", getCourseById);
