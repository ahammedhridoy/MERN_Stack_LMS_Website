import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-lg font-bold mb-2">Sidebar</h2>
      <ul className="space-y-2">
        <li>
          <a href="#" className="text-blue-500 hover:underline">
            Link 1
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline">
            Link 2
          </a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline">
            Link 3
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
