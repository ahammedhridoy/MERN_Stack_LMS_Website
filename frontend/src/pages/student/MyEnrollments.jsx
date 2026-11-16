import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    fetchEnrolledCourses,
    userData,
    backendUrl,
    getToken,
    calculateTotalLectures,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const totalLectures = calculateTotalLectures(course);
          const completedLectures = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return {
            totalLectures,
            completedLectures,
          };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      setLoading(true);
      fetchEnrolledCourses().finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses && enrolledCourses.length > 0) {
      getCourseProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledCourses]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Learning Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pick up where you left off and track your ongoing course progress.
            </p>
          </div>

          {enrolledCourses.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-xs font-semibold text-brand-700 self-start sm:self-auto">
              <span>{enrolledCourses.length} Enrolled Courses</span>
            </div>
          )}
        </div>

        {loading ? (
          <Loading message="Fetching your enrolled courses..." />
        ) : enrolledCourses.length > 0 ? (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {enrolledCourses.map((course, index) => {
                    const progress = progressArray[index];
                    const percent =
                      progress && progress.totalLectures > 0
                        ? Math.round(
                            (progress.completedLectures /
                              progress.totalLectures) *
                              100
                          )
                        : 0;

                    return (
                      <tr
                        key={course._id || index}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={course.courseThumbnail}
                              alt=""
                              className="w-20 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 line-clamp-1">
                                {course.courseTitle}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Instructor: {course.educator?.name || "Expert"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {calculateCourseDuration(course)}
                        </td>

                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-semibold text-slate-700">
                              {percent}% completed
                            </span>
                            <span className="text-slate-400">
                              {progress?.completedLectures || 0} /{" "}
                              {progress?.totalLectures || 0}
                            </span>
                          </div>
                          <Line
                            percent={percent}
                            strokeWidth={3}
                            strokeColor={percent === 100 ? "#10b981" : "#4f46e5"}
                            trailWidth={3}
                            trailColor="#f1f5f9"
                          />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/player/${course._id}`)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-lg shadow-2xs transition-all cursor-pointer"
                          >
                            <span>
                              {percent === 100 ? "Review Course" : "Continue"}
                            </span>
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {enrolledCourses.map((course, index) => {
                const progress = progressArray[index];
                const percent =
                  progress && progress.totalLectures > 0
                    ? Math.round(
                        (progress.completedLectures / progress.totalLectures) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={course._id || index}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-soft-sm flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={course.courseThumbnail}
                        alt=""
                        className="w-20 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">
                          {course.courseTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {calculateCourseDuration(course)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-700">
                          {percent}% Complete
                        </span>
                        <span className="text-slate-400">
                          {progress?.completedLectures || 0} /{" "}
                          {progress?.totalLectures || 0} lectures
                        </span>
                      </div>
                      <Line
                        percent={percent}
                        strokeWidth={3}
                        strokeColor={percent === 100 ? "#10b981" : "#4f46e5"}
                        trailWidth={3}
                        trailColor="#f1f5f9"
                      />
                    </div>

                    <button
                      onClick={() => navigate(`/player/${course._id}`)}
                      className="w-full py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl transition-all cursor-pointer text-center"
                    >
                      {percent === 100 ? "Review Course" : "Continue Learning"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-soft-sm my-8">
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No courses enrolled yet
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
              You haven't enrolled in any courses yet. Start your journey today
              by exploring our featured catalogs!
            </p>
            <Link
              to="/course-list"
              className="mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
            >
              Explore Course Catalog
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyEnrollments;