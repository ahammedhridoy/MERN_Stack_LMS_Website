import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data);
      } else {
        toast.error(data.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEducator]);

  if (!dashboardData) return <Loading message="Loading dashboard metrics..." />;

  const stats = [
    {
      label: "Total Enrollments",
      value: dashboardData.enrolledStudentsData.length,
      icon: assets.patients_icon,
      color: "bg-blue-50 text-blue-700 border-blue-200/60",
      description: "Active student registrations",
    },
    {
      label: "Published Courses",
      value: dashboardData.totalCourses,
      icon: assets.appointments_icon,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      description: "Live courses in catalog",
    },
    {
      label: "Total Revenue",
      value: `${currency} ${dashboardData.totalEarnings?.toLocaleString() || 0}`,
      icon: assets.earning_icon,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      description: "Gross creator earnings",
    },
  ];

  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50/50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor real-time course enrollments, active students, and overall creator earnings.
          </p>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft-sm hover:shadow-soft-md transition-all duration-200 flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}
              >
                <img src={stat.icon} alt="" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Enrollments Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Student Enrollments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Students who recently joined your published curriculum
              </p>
            </div>
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60">
              Live Feed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                <tr>
                  <th className="hidden sm:table-cell px-6 py-3.5 text-center w-12">
                    #
                  </th>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Enrolled Course</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {dashboardData.enrolledStudentsData.length > 0 ? (
                  dashboardData.enrolledStudentsData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="hidden sm:table-cell px-6 py-4 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.student?.imageUrl || assets.profile_img_1
                            }
                            alt=""
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                          />
                          <span className="font-semibold text-slate-900">
                            {item.student?.name || "Student"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {item.courseTitle}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No student enrollments yet. Share your course link to start receiving students!
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

export default Dashboard;