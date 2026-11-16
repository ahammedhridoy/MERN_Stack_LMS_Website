import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams, Link } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      let tempCourses = [...allCourses];

      if (input) {
        const normalizedInput = decodeURIComponent(input).toLowerCase();
        tempCourses = tempCourses.filter((item) =>
          (item?.courseTitle ?? "").toLowerCase().includes(normalizedInput)
        );
      }

      // Sorting
      if (sortBy === "price-low") {
        tempCourses.sort((a, b) => a.coursePrice - b.coursePrice);
      } else if (sortBy === "price-high") {
        tempCourses.sort((a, b) => b.coursePrice - a.coursePrice);
      } else if (sortBy === "discount") {
        tempCourses.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      }

      setFilteredCourse(tempCourses);
    } else {
      setFilteredCourse([]);
    }
  }, [allCourses, input, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-24 pt-8 sm:pt-12 pb-16">
        {/* Header & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200/80">
          <div>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-2">
              <Link
                to="/"
                className="hover:text-brand-600 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Course Catalog</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore All Courses
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Browse top-tier programs designed to accelerate your career.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <SearchBar data={input ? decodeURIComponent(input) : ""} />
          </div>
        </div>

        {/* Filter / Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-slate-600">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredCourse.length}
              </span>{" "}
              courses
            </p>

            {input && (
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200/70 rounded-full">
                <span>Keyword: "{decodeURIComponent(input)}"</span>
                <button
                  onClick={() => navigate("/course-list")}
                  aria-label="Remove filter"
                  className="hover:text-brand-900 cursor-pointer"
                >
                  <img src={assets.cross_icon} alt="" className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <label htmlFor="sort-select" className="text-slate-500 font-medium">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="default">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mt-8">
          {filteredCourse.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCourse.map((course) => (
                <CourseCard course={course} key={course._id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-soft-sm my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <img
                  src={assets.search_icon}
                  alt=""
                  className="w-7 h-7 opacity-40"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No courses found
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                We couldn't find any courses matching your search criteria. Try
                adjusting your keywords or reset your filters.
              </p>
              <button
                onClick={() => navigate("/course-list")}
                className="mt-6 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesList;