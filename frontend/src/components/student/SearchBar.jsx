import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 p-2 rounded-l-lg"
      />
      <button className="bg-blue-500 text-white p-2 rounded-r-lg">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
