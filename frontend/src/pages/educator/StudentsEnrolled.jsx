import { useContext, useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const StudentsEnrolled = () => {
  const { backendUrl, isEducator, getToken } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-Students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) fetchEnrolledStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEducator]);

  if (!enrolledStudents)
    return <Loading message="Loading student enrollment roster..." />;

  const filteredStudents = enrolledStudents.filter((enrollment) =>
    (enrollment.student?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (enrollment.course?.courseTitle || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50/50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Enrolled Students
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View all students enrolled across your published courses.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs placeholder-slate-400"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                <tr>
                  <th className="hidden sm:table-cell px-6 py-4 text-center w-12">
                    #
                  </th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Course Title</th>
                  <th className="hidden sm:table-cell px-6 py-4">
                    Enrollment Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((enrollment, index) => (
                    <tr
                      key={`${enrollment.student?.id || index}-${
                        enrollment.course?.id || index
                      }`}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="hidden sm:table-cell px-6 py-4 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              enrollment.student?.imageUrl ||
                              assets.profile_img_1
                            }
                            alt=""
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                          />
                          <span className="font-semibold text-slate-900">
                            {enrollment.student?.name || "Student"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {enrollment.course?.courseTitle || "Course"}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-xs text-slate-500">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      {searchTerm
                        ? "No students match your filter search."
                        : "No students have enrolled in your courses yet."}
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

export default StudentsEnrolled;