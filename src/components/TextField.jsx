import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from "react";

const TextField = ({
  loading = false,
  title,
  className = "",
  name = "",
  error = "",
  touched = false,
  placeholder = "",
  iconsearch = false,
  value,
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Fragment>
      <div className="relative">
        {/* Label */}
        <label htmlFor={name} className="font-light">
          <div className="flex justify-between">
            <label htmlFor={name} className="text-color-blue font-light">
              <h4 className={`line-clamp-1`}>
                {title}
                {required && <span className="text-red-500 font-bold">*</span>}
              </h4>
            </label>
          </div>
        </label>

        {/* Input field */}
        <div className="relative w-full">
          {iconsearch && (
            <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
          )}

          <input
            value={loading ? "กำลังดึงข้อมูล..." : value}
            id={name}
            className={
              `${loading ? "!text-zinc-400" : ""} ` +
              (className
                ? `input_default ${className}`
                : `${
                    touched
                      ? error
                        ? "input_error"
                        : value && value !== ""
                        ? "input_success"
                        : "input_default"
                      : "input_default"
                  } 
                  ${iconsearch ? "pl-10" : "pl-3"} 
                  !h-10`)
            }
            autoComplete="off"
            placeholder={placeholder}
            disabled={loading}
            {...props}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default TextField;
