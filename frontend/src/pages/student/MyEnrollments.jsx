import React from "react";

const MyEnrollments = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Enrollments</h1>
      <p className="text-gray-600 mb-4">
        You are enrolled in the following courses:
      </p>
      <ul className="list-disc list-inside">
        <li>Course 1</li>
        <li>Course 2</li>
        <li>Course 3</li>
      </ul>
    </div>
  );
};

export default MyEnrollments;
