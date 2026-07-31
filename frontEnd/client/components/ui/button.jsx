import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 [&_svg]:size-4",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700 [&_svg]:size-4",
        outline:
          "border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 [&_svg]:size-4",
        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 [&_svg]:size-4",
        ghost:
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 [&_svg]:size-4",
        link:
          "text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700 [&_svg]:size-4",
      },
      size: {
        default: "h-9 px-4 text-sm rounded-lg",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-11 px-6 text-sm rounded-lg",
        xl: "h-12 px-8 text-base rounded-xl",
        icon: "h-9 w-9 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }