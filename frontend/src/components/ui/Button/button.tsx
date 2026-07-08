import { cn } from "@/lib/utils"
import * as React from "react";
import { NavLink } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";


const buttonVariants = cva(
  "flex items-center justify-center gap-4 rounded-full font-inter font-bold border-2 border-indigo-600 shadow-lg hover:shadow-indigo-600/30 hover:cursor-pointer hover:cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-purple-800 to-indigo-400 text-white hover:shadow-indigo-600/30",
        secondary: "bg-white text-indigo-600 border-2 border-indigo-600 hover:shadow-indigo-600/30",
      },
      size: {
        sm: "w-[180px] px-4 py-2 text-md",
        md: "w-[220px] px-4 py-2 text-md",
        lg: "h-12 px-6 text-lg",
        icon: "h-5 w-5",
      },
      defaultVariants: {
        variant: "primary",
        size: "sm",
      },
    }
  }
)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, leftIcon, rightIcon, href, children, ...props }, ref) => {
  const content = (
    <>
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </>
  );
  return href ? (
    <NavLink
      to={href}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
    >
      {content}
    </NavLink>
  ) : (
    <button
      ref={ref}
      type="button"
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
export default Button
