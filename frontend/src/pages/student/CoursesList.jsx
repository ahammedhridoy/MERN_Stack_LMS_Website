import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();

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
          <SearchBar data={input} />
        </div>
        <div>
          <div className="grid grid-cols-1 gap-3 px-2 my-16 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 md:p-0">
            {allCourses.map((course) => (
              <CourseCard course={course} key={course._id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesList;
