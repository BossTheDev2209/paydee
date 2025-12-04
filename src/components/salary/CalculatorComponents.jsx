import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

export const CalculatorCard = ({ title, children, className, ...props }) => {
    return (
        <div className={cn("w-full rounded-2xl shadow-lg bg-white dark:bg-[#2b2b2b]", className)} {...props}>
            <div className="bg-[#ffcc00] py-3 px-6 text-center rounded-t-2xl">
                <h2 className="text-xl md:text-2xl font-bold text-[#2b2b2b]">{title}</h2>
            </div>
            <div className="p-6 md:p-8 bg-[#e5e5e5] dark:bg-[#3d3d3d] rounded-b-2xl">
                {children}
            </div>
        </div>
    );
};

export const CalculatorSection = ({ title, children, className }) => {
    return (
        <div className={cn("bg-white dark:bg-[#2b2b2b] rounded-xl p-6 mb-6 shadow-sm", className)}>
            {title && (
                <h3 className="text-xl md:text-2xl font-bold text-[#2b2b2b] dark:text-white mb-6">
                    {title}
                </h3>
            )}
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

export const CalculatorInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    required = false,
    unit = "บาท",
    unitOptions,
    currentUnit,
    onUnitChange,
    error,
    touched,
    setFieldValue,
    savedValue
}) => {
    // เช็คค่าจาก Financial profile
    const isPrefilled = savedValue && value === savedValue;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 relative">
            <label className="text-[#2b2b2b] dark:text-gray-200 font-medium md:w-5/12 text-sm md:text-base">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="flex-1 w-full md:w-auto relative">
                <Input
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        // ตัวกรองค่าเป็นตัวเลข
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setFieldValue(name, val);
                    }}
                    className={cn(
                        "w-full transition-colors duration-300",
                        touched && error ? "border-red-500 focus-visible:ring-red-500" : "",
                        isPrefilled ? "text-green-600 dark:text-green-400 font-semibold" : ""
                    )}
                />
                {touched && error && (
                    <span className="text-xs text-red-500 absolute -bottom-5 left-0 z-10">{error}</span>
                )}
            </div>

            {unitOptions && onUnitChange ? (
                <select
                    value={currentUnit}
                    onChange={(e) => onUnitChange(e.target.value)}
                    className="text-[#2b2b2b] dark:text-gray-200 dark:bg-[#2b2b2b] font-medium min-w-[100px] text-right px-2 py-1 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] hidden md:block"
                >
                    {unitOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <span className="text-[#2b2b2b] dark:text-gray-200 font-medium min-w-[30px] text-right hidden md:block">
                    {unit}
                </span>
            )}
        </div>
    );
};
