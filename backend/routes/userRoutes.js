import express from "express";
import {
  getUserData,
  purchaseCourse,
  userEnrolledCourses,
} from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.get("/all", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
