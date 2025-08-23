import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="h-2 bg-gray-200 relative flex items-center justify-center">
        <motion.div
          className="h-full bg-black absolute left-0 top-0"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <span className="text-xs font-medium text-white relative z-10">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};