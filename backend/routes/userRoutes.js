import express from "express";
import { requireAuth } from "@clerk/express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.get("/all", requireAuth(), getUserData);
userRouter.get("/enrolled-courses", requireAuth(), userEnrolledCourses);
userRouter.post("/purchase", requireAuth(), purchaseCourse);

userRouter.post("/update-course-progress", requireAuth(), updateUserCourseProgress);
userRouter.post("/get-course-progress", requireAuth(), getUserCourseProgress);
userRouter.post("/add-rating", requireAuth(), addUserRating);
