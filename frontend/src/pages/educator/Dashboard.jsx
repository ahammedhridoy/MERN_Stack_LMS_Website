import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className="flex flex-col items-start justify-between min-h-screen gap-8 p-4 pt-8 pb-0 md:p-8 md:pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center w-56 gap-3 p-4 border border-blue-500 rounded-md shadow-md">
            <img src={assets.patients_icon} alt="patients" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-500">Total Enrolments</p>
            </div>
          </div>

          {/*  */}
          <div className="flex items-center w-56 gap-3 p-4 border border-blue-500 rounded-md shadow-md">
            <img src={assets.appointments_icon} alt="patients" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>

          {/*  */}
          <div className="flex items-center w-56 gap-3 p-4 border border-blue-500 rounded-md shadow-md">
            <img src={assets.earning_icon} alt="patients" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {currency} {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
