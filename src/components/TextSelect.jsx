/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from "react";

export function Select({ selectType = "", ...props }) {
  switch (selectType) {
    case "object":
      return <div {...props}>{props.value}</div>;
    case "html":
      return (
        <div {...props}>
          <div className="overflow-hidden whitespace-nowrap">
            <div dangerouslySetInnerHTML={{ __html: props.value }} />
          </div>
        </div>
      );
    default:
      return <input readOnly {...props} />;
  }
}

function TextSelect({
  options,
  value,
  name = "",
  placeholder = "",
  isLoading = false,
  isSearch = true,
  messageLoading = "กำลังโหลดข้อมูล...",
  messageNoData = "ไม่พบข้อมูล",
  messageNoDataStyle = "",
  className = "",
  onChange = false,
  onSearch = false,
  onFocus = false,
  optionValue = "value",
  tooltip = false,
  title = "",

  ...props
}) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [showSelectTooltip, setShowSelectTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const selectRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.getElementById(`search-${name}`)?.focus();
      if (options?.length > 0) {
        const result = options.map((item) => ({
          [optionValue]: item[optionValue],
          labelOptions: item.label,
          options: item,
        }));

        setData(
          searchKey
            ? result.filter((a) =>
                a.labelOptions
                  .toLowerCase()
                  .includes(searchKey.trim().toLowerCase())
              )
            : result
        );
      } else {
        setData([]);
      }
    }
  }, [name, open, optionValue, options, searchKey, value]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearchKey("");
        setShowAll(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [open]);

  const getDisplayValue = () => {
    if (!value) return placeholder || "- เลือก -";
    return value.label || placeholder || "- เลือก -";
  };

  const getTooltipContent = () => {
    if (!value) return placeholder || "- เลือก -";
    return value.label;
  };

  const handleTooltip = (action, e) => {
    if (!tooltip) return;

    if (action === "enter") {
      setShowSelectTooltip(true);
      updateTooltipPosition(e);
    }

    if (action === "move" && showSelectTooltip) {
      updateTooltipPosition(e);
    }

    if (action === "leave") {
      setShowSelectTooltip(false);
    }
  };

  const updateTooltipPosition = (e) => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <Fragment>
      <div className="w-full relative" ref={ref}>
        {/* title */}
        {title && (
          <label
            htmlFor={`select-${name}`}
            className="font-light line-clamp-1"
          >
            {title}
          </label>
        )}

        {/* select box */}
        <div
          className="flex items-center relative"
          ref={selectRef}
          onMouseEnter={(e) => handleTooltip("enter", e)}
          onMouseMove={(e) => handleTooltip("move", e)}
          onMouseLeave={() => handleTooltip("leave")}
        >
          <Select
            {...props}
            id={`select-${name}`}
            value={getDisplayValue()}
            selectType="string"
            name={name}
            className={`${className || "input_default pr-8"} ${
              tooltip ? "cursor-pointer" : ""
            }`}
            onClick={() => {
              setOpen(!open);
              setSearchKey("");
              setShowAll(false);
              onFocus && onFocus();
            }}
          />

          <i className="fas fa-angle-down -ml-6 fill-current text-base"></i>

          {tooltip && showSelectTooltip && (
            <div
              className="absolute z-[9999] bg-gray-600 text-white text-[16px] py-1 px-2 rounded whitespace-nowrap pointer-events-none"
              style={{
                left: `${tooltipPosition.x + 10}px`,
                top: `${tooltipPosition.y + 30}px`,
                transform: "translateX(-50%)",
              }}
            >
              {getTooltipContent()}
            </div>
          )}
        </div>

        {/* dropdown */}
        <div
          className={`border rounded-md shadow-sm p-2 w-full absolute z-[50] bg-white dark:bg-[#353535] ${
            !open && "hidden"
          }`}
        >
          {isSearch && (
            <div className="flex items-center mb-2 relative">
              <i className="fas fa-search ml-3 mt-[2px] fill-current text-gray-400 text-md z-10"></i>
              <input
                autoComplete="off"
                id={`search-${name}`}
                value={searchKey}
                className="w-full py-1 font-light dark:bg-[#3d3d3d] rounded-lg outline-none h-10 px-2 border border-gray-400 pl-9 -ml-7"
                onChange={(e) => {
                  const keySearch = e.target.value || "";
                  onSearch && onSearch(keySearch);
                  setSearchKey(keySearch);
                }}
              />
            </div>
          )}

          <ul className="list-none max-h-64 overflow-y-auto">
            {isLoading ? (
              <li className="p-2">{messageLoading}</li>
            ) : data.length === 0 ? (
              <li className={`p-2 ${messageNoDataStyle}`}>
                {messageNoData}
              </li>
            ) : (
              data
                .slice(0, showAll ? data.length : 50)
                .map((item) => (
                  <li
                    key={item[optionValue]}
                    className="p-2 rounded-md my-[2px] hover:bg-[#ffcc00] hover:text-[#3d3d3d] cursor-pointer font-light"
                    onClick={() => {
                      onChange && onChange(item.options);
                      setOpen(false);
                      setSearchKey("");
                      setShowAll(false);
                      document.getElementById(`select-${name}`)?.focus();
                    }}
                  >
                    {item.labelOptions}
                  </li>
                ))
            )}

            {data.length > 50 && (
              <li
                className="p-2 text-center cursor-pointer"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "-- แสดงน้อยลง --" : "-- แสดงทั้งหมด --"}
              </li>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default TextSelect;
