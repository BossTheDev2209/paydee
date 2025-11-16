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
  titleClassName = "",
  options,
  value,
  required = false,
  disabled = false,
  isMultiDefault = "",
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
  onBlur = false,
  optionValue = "value",
  tooltip = false,
  optionLabel = false,
  title = "",
  isMulti = false,
  titleElement,
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
        const result = options.map((item) => {
          return {
            [optionValue]: item[optionValue],
            labelOptions: options
              .filter((a) => a[optionValue] === item[optionValue])
              .map(optionLabel ? optionLabel : (a) => a["label"])
              .toString(),
            options: item,
          };
        });
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
  }, [name, open, optionLabel, optionValue, options, searchKey, value]);

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

  function SetValue(data) {
    let value = "";
    if (data.length > 0) {
      if (data.length === 1) {
        if (Array.isArray(data[0])) {
          value = data[0]
            .join(" ")
            .split(" ")
            .filter((a) => a !== "")
            .join(" ");
        } else {
          value = data[0]
            .split(" ")
            .filter((a) => a !== "")
            .join(" ");
        }
      } else {
        value = data;
      }
    }
    return value;
  }

  const getTooltipContent = () => {
    if (!value?.length) return placeholder || "- เลือก -";

    if (isMulti) {
      if (isMultiDefault) return isMultiDefault;
      if (value.length === 1) {
        return SetValue(
          value.map(optionLabel ? optionLabel : (a) => a["label"])
        );
      }
      return `${value.length} รายการ`;
    }

    return SetValue(value.map(optionLabel ? optionLabel : (a) => a["label"]));
  };

  const handleSelectTooltip = (action, e) => {
    if (!tooltip) return;

    switch (action) {
      case "enter":
        if (!disabled) {
          setShowSelectTooltip(true);
          if (e) updateTooltipPosition(e);
        }
        break;
      case "move":
        if (showSelectTooltip && e) {
          updateTooltipPosition(e);
        }
        break;
      case "leave":
        setShowSelectTooltip(false);
        break;
      default:
        break;
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
        <div className="flex justify-between">
          <label
            htmlFor={`select-${name}`}
            className={
              title ? `${titleClassName} font-light line-clamp-1` : "hidden"
            }
          >
            {title} {required && <span className="text-red-500">*</span>}
          </label>
          {titleElement && titleElement}
        </div>
        <div
          className="flex items-center relative"
          ref={selectRef}
          onMouseEnter={(e) => handleSelectTooltip("enter", e)}
          onMouseMove={(e) => handleSelectTooltip("move", e)}
          onMouseLeave={() => handleSelectTooltip("leave")}
        >
          <Select
            {...props}
            id={`select-${name}`}
            disabled={disabled}
            value={
              value?.length > 0 && Array.isArray(value)
                ? isMulti
                  ? isMultiDefault || `${value.length} รายการ`
                  : SetValue(
                      value.map(optionLabel ? optionLabel : (a) => a["label"])
                    )
                : placeholder || "- เลือก -"
            }
            selectType={
              typeof (
                value?.length > 0 &&
                Array.isArray(value) &&
                value.map(optionLabel ? optionLabel : (a) => a["label"])[0]
              )
            }
            name={name}
            className={`${className || "input_default pr-8"} ${
              disabled ? "input_disabled pr-8" : ""
            } ${tooltip ? "cursor-pointer" : ""}`}
            onClick={() => {
              setOpen(!open);
              setSearchKey("");
              setShowAll(false);
              onFocus && onFocus();
            }}
            onBlur={onBlur}
          />
          <i className="fas fa-angle-down -ml-6 fill-current text-gray-600 text-base"></i>
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
        <div
          className={`border rounded-md shadow-sm p-2 w-full absolute z-[50] bg-white ${
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
                className="w-full py-1 font-light rounded-lg outline-none h-10 px-2 border border-gray-400 pl-9 -ml-7"
                onChange={(e) => {
                  const keySearch = e.target.value || "";
                  onSearch && onSearch(keySearch);
                  setSearchKey(keySearch);
                }}
              />
            </div>
          )}
          <ul className={`list-none max-h-64 ${open ? "overflow-y-auto" : ""}`}>
            {isLoading ? (
              <li className="p-2 rounded-md">
                <span>{messageLoading}</span>
              </li>
            ) : data.length === 0 ? (
              <li className={`p-2 rounded-md ${messageNoDataStyle}`}>
                <span>{messageNoData}</span>
              </li>
            ) : (
              data.slice(0, showAll ? data.length : 50).map((item, index) => (
                <li
                  key={optionValue ? item[optionValue] : index}
                  className={`p-2 rounded-md my-[2px] hover:bg-[#2C4150] hover:text-white cursor-pointer font-light ${
                    Array.isArray(value) &&
                    value.filter((a) => a[optionValue] === item[optionValue])
                      .length > 0 &&
                    "bg-[#2C4150] text-white"
                  }`}
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
            {data.length > 50 && !isLoading && (
              <li
                className="p-2 rounded-md text-center hover:bg-blue-s5 cursor-pointer"
                onClick={() => setShowAll(!showAll)}
              >
                <span>
                  {showAll ? "-- แสดงน้อยลง --" : "-- แสดงทั้งหมด --"}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default TextSelect;