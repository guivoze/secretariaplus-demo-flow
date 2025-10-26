import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Step9PreChat = () => {
  const { nextStep } = useSupabaseDemo();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // 1s loader
    const successTimer = setTimeout(() => {
      setShowSuccess(true);
      
      // Confetti burst único
      (window as any).confetti?.({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1000);

    // 3s total, depois avança
    const nextTimer = setTimeout(() => {
      nextStep();
    }, 3000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(nextTimer);
    };
  }, [nextStep]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/40 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {!showSuccess ? (
          <>
            <img 
              src="/imgs/loader.webp" 
              alt="Loading" 
              className="w-16 h-16 object-contain"
            />
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">
              Teste liberado
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
