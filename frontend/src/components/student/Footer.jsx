import React, { useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <img
                src={assets.eduka}
                alt="Eduka Logo"
                className="w-10 h-auto brightness-110"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Eduka
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              Empowering global learners through career-defining, hands-on
              courses created by experienced industry practitioners.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { name: "Facebook", icon: assets.facebook_icon, href: "https://facebook.com" },
                { name: "Twitter", icon: assets.twitter_icon, href: "https://twitter.com" },
                { name: "Instagram", icon: assets.instagram_icon, href: "https://instagram.com" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Eduka on ${social.name}`}
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:border-slate-700 transition-all duration-200"
                >
                  <img
                    src={social.icon}
                    alt=""
                    aria-hidden="true"
                    className="w-4 h-4 opacity-75 hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/course-list" className="hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/my-enrollments" className="hover:text-white transition-colors">
                  My Learning
                </Link>
              </li>
              <li>
                <Link to="/educator" className="hover:text-white transition-colors">
                  Teach on Eduka
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Certifications</span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Stay in the Loop
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get weekly curriculum updates, free tutorials, and student discounts.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                required
              />
              <button
                type="submit"
                className="w-full py-2 text-xs font-semibold uppercase tracking-wider text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Eduka LMS Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">
              Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;