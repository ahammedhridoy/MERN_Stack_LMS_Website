import React from "react";

const CourseCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold">Course Title</h3>
      <p className="mt-2">Course description goes here.</p>
      <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">
        Enroll Now
      </button>
    </div>
  );
};

export default CourseCard;
