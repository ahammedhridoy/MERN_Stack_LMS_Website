import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = ({ message = "Loading content..." }) => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [path, navigate]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        {/* Inner subtle dot */}
        <div className="absolute w-3 h-3 bg-brand-500 rounded-full animate-ping" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide animate-pulse">
        {message}
      </p>
      <span className="sr-only">Loading, please wait...</span>
    </div>
  );
};

export default Loading;