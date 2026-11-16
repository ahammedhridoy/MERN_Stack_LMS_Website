import Stripe from "stripe";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import CourseProgress from "../models/CourseProgress.js";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("getUserData error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch user data" });
  }
};

// User Enrolled course with lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userData = await User.findById(userId).populate("enrolledCourses");
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.error("userEnrolledCourses error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch enrolled courses" });
  }
};

// Purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.status(404).json({ success: false, message: "Course or User not found" });
    }

    // Check if already enrolled
    if (userData.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    const amount = Number(
      (
        courseData.coursePrice -
        ((courseData.discount || 0) * courseData.coursePrice) / 100
      ).toFixed(2)
    );

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount,
      status: "pending",
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Initialize Stripe Gateway
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = (process.env.CURRENCY || "usd").toLowerCase();

    // Line items for Stripe Checkout
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ];

    const redirectBase = origin || process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${redirectBase}/loading/my-enrollments`,
      cancel_url: `${redirectBase}/course/${courseId}`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("purchaseCourse error:", error.message);
    res.status(500).json({ success: false, message: "Payment session creation failed" });
  }
};

// Update user course progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { courseId, lectureId } = req.body;
    if (!courseId || !lectureId) {
      return res.status(400).json({ success: false, message: "Course ID and Lecture ID required" });
    }

    const progressData = await CourseProgress.findOne({ courseId, userId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    console.error("updateUserCourseProgress error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update course progress" });
  }
};

// Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    console.error("getUserCourseProgress error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch course progress" });
  }
};

// Add User Ratings to Course
export const addUserRating = async (req, res) => {
  const userId = req.auth?.userId;
  const { courseId, rating } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!courseId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Valid Course ID and Rating (1-5) required" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to leave a rating.",
      });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    return res.json({ success: true, message: "Rating submitted successfully" });
  } catch (error) {
    console.error("addUserRating error:", error.message);
    res.status(500).json({ success: false, message: "Failed to submit rating" });
  }
};
