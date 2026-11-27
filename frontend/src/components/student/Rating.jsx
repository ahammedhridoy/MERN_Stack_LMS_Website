import React, { useEffect, useState } from "react";

const Rating = ({ initialRating = 0, onRate, readonly = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (value) => {
    if (readonly) return;
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating !== undefined) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div
      className="inline-flex items-center gap-1 select-none"
      role="group"
      aria-label="Rating component"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverRating || rating) >= starValue;

        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            className={`p-0.5 rounded transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-brand-400 ${
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-95"
            }`}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
          >
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${
                isFilled
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-300 fill-transparent hover:text-amber-200"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default Rating;