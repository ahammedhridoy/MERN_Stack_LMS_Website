import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="relative overflow-hidden w-full pt-16 pb-12 md:pt-24 md:pb-20 text-center px-4 sm:px-6 md:px-8 bg-gradient-to-b from-indigo-50/80 via-slate-50/40 to-white">
      {/* Decorative ambient background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-200/30 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Trust Pill / Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs sm:text-sm font-medium text-brand-700 bg-white border border-brand-200/80 rounded-full shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
          <span>Over 10,000+ Students Learning Every Day</span>
        </div>

        {/* Hero Title */}
        <h1 className="relative font-bold text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight max-w-3xl">
          Empower your future with courses designed to{" "}
          <span className="relative inline-block text-brand-600">
            fit your choice.
            <img
              src={assets.sketch}
              alt=""
              aria-hidden="true"
              className="absolute -bottom-3 sm:-bottom-5 right-0 w-full object-contain pointer-events-none"
            />
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
          We bring together world-class instructors, interactive projects, and a
          supportive community to help you achieve your personal and
          professional career milestones.
        </p>

        {/* Search Bar Container */}
        <div className="w-full flex justify-center mt-8 sm:mt-10">
          <SearchBar />
        </div>

        {/* Quick Highlights / Social Proof Mini-Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-base">★</span>
            <span className="font-semibold text-slate-700">4.9/5</span> average rating
          </div>
          <span className="hidden sm:inline-block text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Lifetime course access</span>
          </div>
          <span className="hidden sm:inline-block text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span>🎓 Verified completion certificates</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;