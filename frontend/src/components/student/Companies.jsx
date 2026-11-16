import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  const companies = [
    { name: "Microsoft", logo: assets.microsoft_logo },
    { name: "Walmart", logo: assets.walmart_logo },
    { name: "Accenture", logo: assets.accenture_logo },
    { name: "Adobe", logo: assets.adobe_logo },
    { name: "PayPal", logo: assets.paypal_logo },
  ];

  return (
    <section className="w-full py-10 border-y border-slate-100 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-slate-500 mb-6">
          Trusted by learners & engineers from leading teams worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;