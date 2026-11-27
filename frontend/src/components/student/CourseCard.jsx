import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  const rating = calculateRating(course);
  const discountedPrice = (
    (course.coursePrice * (100 - (course.discount || 0))) /
    100
  ).toFixed(2);

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      {/* Thumbnail with zoom effect on hover */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={course.courseThumbnail}
          alt={course.courseTitle}
          loading="lazy"
        />
        {course.discount > 0 && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-xs font-bold text-white bg-rose-500 rounded-full shadow-xs">
            {course.discount}% OFF
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 text-left justify-between">
        <div>
          {/* Educator Name */}
          <p className="text-xs font-medium text-brand-700 tracking-wide uppercase">
            {course?.educator?.name || "Professional Instructor"}
          </p>

          {/* Title with 2-line clamp */}
          <h3 className="mt-1.5 text-base font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {course.courseTitle}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
              <span>{rating.toFixed(1)}</span>
              <span className="text-amber-500">★</span>
            </span>

            <div className="flex items-center" aria-label={`Rating ${rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <img
                  className="w-3.5 h-3.5"
                  key={i}
                  src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                  alt=""
                  aria-hidden="true"
                />
              ))}
            </div>

            <span className="text-xs text-slate-400">
              ({course.courseRatings ? course.courseRatings.length : 0})
            </span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              {currency}
              {discountedPrice}
            </span>
            {course.discount > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {currency}
                {course.coursePrice}
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
            Enroll <span>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;