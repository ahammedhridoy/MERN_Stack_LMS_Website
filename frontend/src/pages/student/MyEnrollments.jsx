import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "./../../components/student/Footer";

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } =
    useContext(AppContext);
  const [progressArray, setProgressArray] = React.useState([
    { courseId: 1, completedLectures: 4, totalLectures: 10 },
    { courseId: 2, completedLectures: 6, totalLectures: 12 },
    { courseId: 3, completedLectures: 8, totalLectures: 15 },
    { courseId: 4, completedLectures: 5, totalLectures: 10 },
    { courseId: 5, completedLectures: 0, totalLectures: 8 },
    { courseId: 6, completedLectures: 2, totalLectures: 8 },
    { courseId: 7, completedLectures: 0, totalLectures: 8 },
    { courseId: 8, completedLectures: 8, totalLectures: 8 },
  ]);

  return (
    <>
      <div className="px-8 py-10 md:px-36">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="w-full mt-10 overflow-hidden border table-fixed md:table-auto">
          <thead className="text-sm text-left text-gray-900 border-b border-gray-500/20 max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="flex items-center py-3 pl-2 space-x-3 md:px-4 md:pl-4">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <Line
                      percent={
                        progressArray[index]
                          ? (progressArray[index].completedLectures /
                              progressArray[index].totalLectures) *
                            100
                          : 0
                      }
                      strokeWidth={1}
                      strokeColor={
                        progressArray[index] &&
                        progressArray[index].completedLectures > 0
                          ? "#3b82f6"
                          : "transparent"
                      }
                      trailColor="#e5e7eb"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index] &&
                    `${progressArray[index].completedLectures} / ${progressArray[index].totalLectures}`}{" "}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 max-sm:right">
                  <button
                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white"
                    onClick={() => navigate(`/player/${course._id}`)}
                  >
                    {progressArray[index] &&
                    progressArray[index].completedLectures <
                      progressArray[index].totalLectures
                      ? "On Going"
                      : "Completed"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
