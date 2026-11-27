import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14 text-left">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/50">
            Top Rated Curriculum
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Learn from industry experts
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
            Discover our highest-rated courses across software, design, product,
            and business. Handcrafted with hands-on projects to deliver tangible results.
          </p>
        </div>

        <Link
          to="/course-list"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-full transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 shrink-0"
        >
          <span>View all courses</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Courses Grid */}
      {allCourses && allCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCourses.slice(0, 4).map((course, index) => (
            <CourseCard key={course._id || index} course={course} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-4 h-80 animate-pulse flex flex-col justify-between"
            >
              <div className="w-full aspect-video bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Mobile view all link */}
      <div className="mt-10 text-center md:hidden">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-full transition-all duration-200 cursor-pointer active:scale-95"
        >
          <span>Explore all courses</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
};

export default CoursesSection;