import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 px-6 sm:px-8 py-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div className="flex items-center gap-3">
        <img src={assets.eduka} alt="Eduka" className="w-6 h-auto" />
        <span>© {new Date().getFullYear()} Eduka Educator Studio. All rights reserved.</span>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <img src={assets.facebook_icon} alt="" className="w-4 h-4" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <img src={assets.twitter_icon} alt="" className="w-4 h-4" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <img src={assets.instagram_icon} alt="" className="w-4 h-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;