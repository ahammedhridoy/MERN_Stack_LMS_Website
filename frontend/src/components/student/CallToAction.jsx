import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const CallToAction = () => {
  const { navigate, isEducator } = useContext(AppContext);

  return (
    <section className="w-full py-12 px-4 sm:px-8 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-indigo-900 to-slate-900 p-8 sm:p-12 md:p-16 text-center text-white shadow-soft-xl">
        {/* Ambient background glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-300 bg-brand-800/60 px-3.5 py-1.5 rounded-full border border-brand-700/50 mb-4 backdrop-blur-xs">
            Start Your Journey Today
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Anytime, anywhere. Master the skills that matter most.
          </h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gain immediate access to in-demand courses, certified educators, and
            a global network of passionate peers building the future.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 sm:mt-10 font-medium">
            <Link
              to="/course-list"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm sm:text-base font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-full transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              Explore All Courses
            </Link>

            <button
              onClick={() => navigate(isEducator ? "/educator" : "/course-list")}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-medium text-white hover:text-brand-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-xs active:scale-95"
            >
              <span>{isEducator ? "Educator Dashboard" : "Become an Educator"}</span>
              <img
                src={assets.arrow_icon}
                alt=""
                aria-hidden="true"
                className="w-3.5 h-3.5 brightness-0 invert"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;