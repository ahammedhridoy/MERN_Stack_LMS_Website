import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) fetchEducatorCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEducator]);

  if (!courses) return <Loading message="Loading your courses..." />;

  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50/50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Created Courses
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your published content, monitor student enrollments, and track course earnings.
            </p>
          </div>

          <Link
            to="/educator/add-course"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>+</span>
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {courses.length > 0 ? (
                  courses.map((course, index) => {
                    const price =
                      course.coursePrice -
                      ((course.discount || 0) * course.coursePrice) / 100;
                    const revenue = Math.floor(
                      (course.enrolledStudents?.length || 0) * price
                    );

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
                              className="w-16 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 line-clamp-1">
                                {course.courseTitle}
                              </p>
                              <span className="text-xs text-slate-400">
                                {course.courseContent?.length || 0} chapters
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-900">
                          {currency} {revenue.toLocaleString()}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-600">
                          {course.enrolledStudents?.length || 0}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Live
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/course/${course._id}`}
                            target="_blank"
                            className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
                          >
                            Preview ↗
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      You haven't created any courses yet. Click "Create New Course" above to publish your first program!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;