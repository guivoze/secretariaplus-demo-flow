import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CustomButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}, ref) => {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-900 shadow-card",
    secondary: "bg-primary text-black hover:bg-primary/90",
    outline: "border-2 border-black text-black hover:bg-black hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: disabled ? 0 : -1 }}
      whileTap={{ y: disabled ? 0 : 1 }}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
      className={cn(
        "font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

CustomButton.displayName = "CustomButton";