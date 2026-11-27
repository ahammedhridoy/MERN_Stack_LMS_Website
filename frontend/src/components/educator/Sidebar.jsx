import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/educator",
      icon: assets.home_icon,
    },
    {
      name: "Add Course",
      path: "/educator/add-course",
      icon: assets.add_icon,
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Students Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  if (!isEducator) return null;

  return (
    <aside className="w-16 md:w-64 min-h-[calc(100vh-65px)] bg-white border-r border-slate-200/80 py-6 flex flex-col justify-between shrink-0 transition-all duration-300">
      <nav className="flex flex-col gap-1.5 px-2 md:px-4">
        <p className="hidden md:block px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Studio Navigation
        </p>
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"}
            className={({ isActive }) =>
              `flex items-center justify-center md:justify-start gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-brand-50 text-brand-700 font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                  className={`w-5 h-5 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-60"
                  }`}
                />
                <span className="hidden md:inline">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Hint */}
      <div className="hidden md:block px-6 pt-6 border-t border-slate-100 text-xs text-slate-400">
        <p className="font-semibold text-slate-700">Eduka Studio v2.0</p>
        <p className="mt-0.5">Publish & track your global content</p>
      </div>
    </aside>
  );
};

export default Sidebar;