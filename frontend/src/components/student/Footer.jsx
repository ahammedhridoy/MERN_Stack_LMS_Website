import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full pt-10 text-left bg-gray-900 md:px-36">
      <div className="flex flex-col items-start justify-center gap-10 px-8 py-10 border-b md:flex-row md:px-0 md:gap-32 border-white/30">
        <div className="flex flex-col items-center w-full md:items-start">
          <img src={assets.logo_dark} alt="logo" />
          <p className="mt-6 text-sm text-center md:text-left text-white/80">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>
        <div className="flex flex-col items-center w-full md:items-start">
          <h2 className="mb-5 font-semibold text-white">Company</h2>
          <ul className="flex justify-between w-full text-sm md:flex-col text-white/80 md:space-y-2">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Our Services</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="flex-col items-start hidden w-full md:flex">
          <h2 className="mb-5 font-semibold text-white">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-white/80">
            Stay updated with our latest news and offers. Subscribe now!
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="Enter your email"
              name=""
              id=""
              className="w-64 px-2 text-sm text-gray-500 placeholder-gray-500 bg-gray-800 border rounded outline-none border-gray-500/30 h-9"
            />
            <button className="w-2/4 text-white bg-blue-600 rounded h-9">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="py-4 text-xs text-center md:text-sm text-white/60">
        Copyright 2025 © GreatStack. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
