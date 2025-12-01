import React from "react";

export default function RadioGroup({
  label,
  name,
  options = [],
  value,
  onChange,
  direction = "row",
}) {
  return (
    <div className="my-2">
      {label && (
        <p className="mb-2 font-medium text-gray-800 dark:text-gray-100">
          {label}
        </p>
      )}

      <div
        className={`flex flex-wrap md:flex-nowrap gap-4 text-nowrap ${
          direction === "row" ? "flex-row" : "flex-col"
        }`}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer text-gray-800 dark:text-gray-200"
          >
            {/* real input hidden */}
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="hidden peer"
            />

            {/* custom radio */}
            <span
              className="
                w-4 h-4 rounded-full border 
                 dark:border-gray-300
                peer-checked:bg-yellow-500
                transition-all
              "
            ></span>

            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
