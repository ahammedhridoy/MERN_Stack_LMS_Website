import { AppContext } from "./AppContext";
import { useState, useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [allCourses, setAllCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch all courses from the API
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Calculate evarage rating
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    setAllCourses,
    fetchAllCourses,
    navigate,
    calculateRating,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
