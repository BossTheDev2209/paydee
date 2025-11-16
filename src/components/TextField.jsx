import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState } from "react";
const TextField = ({ loading = false, titleClassName = "", onBlur, onInput, disabled = loading || false, titleDescription = "", title, inputType = "input", useForm = true, showLabel = true, className = "", rows = 5, textarea = false, name = "", error = "", touched = false, placeholder = "", iconsearch = false, titleElement, value, required = false, 
/* onBlur, */ ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (_jsx(Fragment, { children: _jsxs("div", { className: "relative", children: [_jsx("label", { htmlFor: name, className: showLabel ? "font-light" : "hidden", children: _jsxs("div", { className: "flex justify-between", children: [_jsx("label", { htmlFor: name, className: showLabel ? "text-color-blue font-light" : "hidden", children: _jsxs("h4", { className: `line-clamp-1 ${titleClassName}`, children: [title, " ", titleDescription !== "" && (_jsx("span", { className: "text-gray-main font-light", children: titleDescription })), required && _jsx("span", { className: "text-red-500 font-bold", children: "*" })] }) }), titleElement && titleElement] }) }), textarea ? (_jsx("textarea", { id: name, className: `h-full ${className} disabled:input_disabled ${touched
                        ? error
                            ? "input_error"
                            : useForm
                                ? "input_success"
                                : "input_default"
                        : "input_default"} ${textarea ? "" : "!h-10"}`, disabled: disabled, rows: rows, cols: 50, autoComplete: "off", value: value, ...props })) : inputType === "input" ? (_jsxs("div", { className: "relative w-full", children: [iconsearch && (_jsx("i", { className: "fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" })), _jsx("input", { value: loading ? "กำลังดึงข้อมูล..." : value, onInput: onInput, id: name, onBlur: onBlur, className: `${loading && "!text-zinc-400"} ` +
                                (className
                                    ? `input_default ${className}`
                                    : `${touched
                                        ? error
                                            ? "input_error "
                                            : useForm
                                                ? "input_success !border-green-main"
                                                : "input_default"
                                        : `input_default ${iconsearch && "pl-10"}`} 
                    ${iconsearch ? "pl-10" : "pl-3"} 
                    ${disabled
                                        ? !error
                                            ? "input_disabled"
                                            : "input_disabled !border-red-500 text-red-500"
                                        : ""} ${textarea ? "" : "!h-10"}`), autoComplete: "off", placeholder: placeholder, ...props, disabled: disabled || loading })] })) : inputType === "password" ? (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: name, 
                            /* onBlur={onBlur} */ type: `${showPassword ? "text" : "password"}`, className: `${className} ${touched
                                ? error
                                    ? "input-border-is-invalid"
                                    : useForm
                                        ? "input-border-is-valid"
                                        : "field-input"
                                : "field-input"}`, autoComplete: "off" }), _jsx("i", { className: `-ml-7 mt-1 fill-current text-gray-400 text-md z-10 cursor-pointer ${showPassword ? "far fa-eye" : "far fa-eye-slash"}`, onClick: () => setShowPassword((prevShowPassword) => !prevShowPassword) })] })) : null] }) }));
};
export default TextField;
