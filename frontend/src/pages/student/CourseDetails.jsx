import React from "react";

const CourseDetails = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Course Title</h1>
      <p className="text-gray-600 mb-4">Course description goes here.</p>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Instructor</h2>
        <p className="text-gray-600">Instructor Name</p>
      </div>
    </div>
  );
};

export default CourseDetails;
