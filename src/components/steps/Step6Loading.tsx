import { useEffect, useState } from "react";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const loadingSteps = [
  "Buscando seu Instagram",
  "Configurando sua I.A automagicamente", 
  "Nossa, que resultados lindos...",
  "hmm preenchimento labial...",
  "Ajustando sua especialidade",
  "Encontrando sua clínica...",
  "Filtrando procedimentos"
];

export const Step6Loading = () => {
  const { nextStep, userData } = useDemo();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStepIndex < loadingSteps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStepIndex]);
        setCurrentStepIndex(prev => prev + 1);
      }, 600);

      return () => clearTimeout(timer);
    } else {
      // All steps completed, move to next step after a brief delay
      const timer = setTimeout(() => {
        nextStep();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, nextStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-xs font-mono text-gray-600 animate-pulse">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="mb-2">
              {'{ "user": "processing", "ai": "learning", "status": "active" }'}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <CustomCard variant="elevated" className="text-center space-y-6">
          {/* Profile avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">
              {userData.instagram ? userData.instagram.charAt(0).toUpperCase() : 'U'}
            </span>
          </motion.div>

          {/* Loading steps */}
          <div className="space-y-3">
            {loadingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: index <= currentStepIndex ? 1 : 0.3,
                  x: 0 
                }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 text-left ${
                  completedSteps.includes(index) ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index) 
                    ? 'bg-green-500' 
                    : index === currentStepIndex 
                    ? 'bg-primary animate-pulse' 
                    : 'bg-gray-300'
                }`}>
                  {completedSteps.includes(index) ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : index === currentStepIndex ? (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  ) : null}
                </div>
                <span className={`text-sm ${
                  completedSteps.includes(index) ? 'font-medium' : ''
                }`}>
                  {step}
                </span>
                {completedSteps.includes(index) && (
                  <span className="text-green-500 text-sm">✓</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.length / loadingSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </CustomCard>
      </motion.div>
    </div>
  );
};