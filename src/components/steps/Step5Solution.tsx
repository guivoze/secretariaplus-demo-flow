import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

export const Step5Solution = () => {
  const {
    nextStep
  } = useSupabaseDemo();
  
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    // Timer para mostrar o botão após 4 segundos (3s + 1s extra)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  return <div className="h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g fill="none" fillRule="evenodd">
            <g fill="#f5f5f5" fillOpacity="0.4">
              <circle cx="20" cy="20" r="1" />
            </g>
          </g>
        </svg>
      </div>
      
      <motion.div initial={{
      opacity: 0,
      y: 40,
      scale: 0.95
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} transition={{
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }} className="w-full max-w-lg relative z-10">
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
          {/* Hero Image Area */}
          <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
            <motion.img 
              src="/imgs/step5.webp" 
              alt="Humanização e elegância" 
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6,
            duration: 0.5
          }} className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                Humanização & <br />
                <span className="font-normal text-inherit">Elegância</span>
              </h1>
              
              <motion.p 
                className="text-content text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <span className="text-sm">Nem percebem que é IA 🤫</span>
              </motion.p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 1.8,
            duration: 0.5
          }} className="space-y-4 text-center">
              <motion.p 
                className="text-content text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.1, duration: 0.4 }}
              >
                Treinamos nossa IA com <span className="font-medium">+de 100 mil conversas</span> entre recepções e pacientes, analisando o que MAIS converte avaliações.
              </motion.p>
              
              <motion.p 
                className="text-sm text-muted-foreground italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.4 }}
              >
                E você pode ter isso na sua clínica em menos de 24h
              </motion.p>
            </motion.div>

            <AnimatePresence>
              {showButton && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <CustomButton onClick={nextStep} className="w-full text-white bg-black hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]" size="lg">
                    Certo, quero testar! →
                  </CustomButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>;
};