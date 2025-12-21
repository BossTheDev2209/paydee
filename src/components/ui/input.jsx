import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcc00] focus-visible:border-[#ffcc00] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-[#3d3d3d] dark:ring-offset-gray-950 dark:placeholder:text-gray-400",
                "autofill:shadow-[0_0_0_30px_white_inset] dark:autofill:shadow-[0_0_0_30px_#3d3d3d_inset]",
                "[&:-webkit-autofill]:shadow-[0_0_0_30px_white_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_30px_#3d3d3d_inset]",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
