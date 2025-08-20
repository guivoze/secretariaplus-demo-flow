import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, label, error, prefix, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {prefix}
            </div>
          )}
          <input
            className={cn(
              "w-full px-4 py-3 rounded-2xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base",
              prefix && "pl-8",
              error && "border-destructive focus:ring-destructive",
              className
            )}
            style={{ fontSize: '16px', ...props.style }}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";