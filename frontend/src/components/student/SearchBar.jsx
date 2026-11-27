import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data, placeholder = "Search for courses, technologies, instructors..." }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate("/course-list/" + encodeURIComponent(input.trim()));
    } else {
      navigate("/course-list");
    }
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <form
      onSubmit={onSearchHandler}
      role="search"
      className="flex items-center w-full h-12 md:h-14 max-w-xl bg-white border border-slate-200 rounded-full shadow-soft-sm hover:shadow-soft-md focus-within:shadow-soft-md focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all duration-200 px-2 group"
    >
      <label htmlFor="course-search" className="sr-only">
        Search for courses
      </label>
      <div className="flex items-center justify-center pl-3 pr-2 text-slate-400 group-focus-within:text-brand-600 transition-colors">
        <img
          src={assets.search_icon}
          alt=""
          aria-hidden="true"
          className="w-5 h-5 opacity-70 group-focus-within:opacity-100 transition-opacity"
        />
      </div>

      <input
        id="course-search"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="search"
        placeholder={placeholder}
        className="w-full h-full bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm md:text-base font-normal px-1"
      />

      {input && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search text"
          className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <img src={assets.cross_icon} alt="" className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="submit"
        className="inline-flex items-center justify-center px-5 md:px-7 h-9 md:h-10 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-full transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm shrink-0"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;