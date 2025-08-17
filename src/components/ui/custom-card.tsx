import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CustomCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
}

export const CustomCard = ({ 
  children, 
  className, 
  variant = "default" 
}: CustomCardProps) => {
  const variants = {
    default: "bg-card shadow-soft",
    elevated: "bg-card shadow-card",
    bordered: "bg-card border-2 border-border"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl p-6",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
};