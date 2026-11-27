import React from "react";
import { assets, dummyTestimonial } from "./../../assets/assets";

const TestimonialsSection = () => {
  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-12 lg:px-24 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/50">
            Real Stories, Real Impact
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Hear from our thriving alumni
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Discover how thousands of learners transitioned careers, earned
            promotions, and mastered new skills with our curriculum.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {dummyTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-soft-sm hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 relative text-left"
            >
              {/* Quote Mark Decoration */}
              <div
                className="absolute top-5 right-6 text-5xl font-serif text-slate-200/80 pointer-events-none select-none"
                aria-hidden="true"
              >
                “
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4" aria-label={`Rated ${testimonial.rating} stars`}>
                  {[...Array(5)].map((_, i) => (
                    <img
                      className="w-4 h-4"
                      key={i}
                      src={
                        i < Math.floor(testimonial.rating)
                          ? assets.star
                          : assets.star_blank
                      }
                      alt=""
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Feedback Text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  "{testimonial.feedback}"
                </p>
              </div>

              {/* User Details */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-100">
                <img
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-100"
                  src={testimonial.image}
                  alt={testimonial.name}
                  loading="lazy"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;