import React from "react";

const TestimonialsSection = () => {
  return (
    <div className="bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
      <div className="flex flex-col space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">
            "This platform has changed my life! The courses are top-notch."
          </p>
          <span className="text-gray-500">- Happy Student</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">
            "I learned so much and landed my dream job thanks to the resources
            here."
          </p>
          <span className="text-gray-500">- Grateful Learner</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
