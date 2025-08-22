import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";

export const Step3Pain = () => {
  const { nextStep } = useSupabaseDemo();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g fill="none" fillRule="evenodd">
            <g fill="#f5f5f5" fillOpacity="0.4">
              <circle cx="20" cy="20" r="1"/>
            </g>
          </g>
        </svg>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
          {/* Hero Image Area */}
          <div className="relative h-48 bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-muted/30 rounded-2xl flex items-center justify-center">
                <div className="text-muted-foreground text-4xl">📱</div>
              </div>
            </div>
            <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground/80 bg-card/80 rounded-full px-3 py-1">
              STEP 3
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                É frustrante, né?
              </h1>
              
              <p className="text-content text-muted-foreground leading-relaxed">
                Se profissionalizar cada vez mais e perder pacientes por demora, ou falta de qualidade no atendimento por mensagem...
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
            >
              <p className="text-lg font-semibold text-foreground text-center leading-tight">
                73% dos pacientes SOMEM se você leva mais de 3 min. pra responder.
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2 italic">
                Mas não precisa ser assim...
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <CustomButton
                onClick={nextStep}
                className="w-full text-white bg-black hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
              >
                Como assim? →
              </CustomButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};