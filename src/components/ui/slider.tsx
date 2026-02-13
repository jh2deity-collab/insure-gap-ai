import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input
            type="range"
            className={cn("w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500", className)}
            ref={ref}
            {...props}
        />
    )
)
Slider.displayName = "Slider"

export { Slider }
