import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const image = req.file;
    const educatorId = req.auth.userId;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // Parse course data
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    // Upload image first
    const imageUpload = await cloudinary.uploader.upload(image.path);
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    // Create course with thumbnail
    const newCourse = await Course.create(parsedCourseData);

    res.json({
      success: true,
      message: "Course added successfully",
      course: newCourse,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get educator course

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator: educator });

    res.json({ success: true, courses });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get educator dashboard
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator: educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // calculate earnings
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Collect unique students ids with courses
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      totalCourses,
      totalEarnings,
      enrolledStudentsData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get enrolled students data

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educatorId = req.auth?.userId;
    if (!educatorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // find all courses for this educator and populate students
    const courses = await Course.find({ educator: educatorId }).populate(
      "enrolledStudents",
      "name imageUrl email"
    );

    if (!courses.length) {
      return res.json({ success: true, enrolledStudents: [] });
    }

    // flatten all enrolled students with course info
    const enrolledStudents = courses.flatMap((course) =>
      course.enrolledStudents.map((student) => ({
        student: {
          id: student._id,
          name: student.name,
          imageUrl: student.imageUrl,
          email: student.email,
        },
        course: {
          id: course._id,
          courseTitle: course.courseTitle,
        },
        enrolledAt: new Date(), // you can replace with real enrollment date if available
      }))
    );

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
