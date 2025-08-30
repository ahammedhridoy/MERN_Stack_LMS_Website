import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = [...allCourses]; // shallow copy

      if (input) {
        const normalizedInput = input.toLowerCase();
        setFilteredCourse(
          tempCourses.filter((item) =>
            (item?.courseTitle ?? "").toLowerCase().includes(normalizedInput)
          )
        );
      } else {
        setFilteredCourse(tempCourses);
      }
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative px-8 pt-20 text-left md:px-36">
        <div className="flex flex-col items-start justify-between w-full gap-6 md:flex-row">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input ?? ""} />
        </div>

        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 mt-8 -mb-8 text-gray-600 border">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt="cross"
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 px-2 my-16 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 md:p-0">
          {filteredCourse.length > 0 ? (
            filteredCourse.map((course) => (
              <CourseCard course={course} key={course._id} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No courses found
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
