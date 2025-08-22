
import { useState } from "react";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";

export const DebugNavigator = () => {
  const { currentStep, setCurrentStep } = useSupabaseDemo();
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    { id: 0, name: "Landing" },
    { id: 1, name: "Modal Preview" },
    { id: 2, name: "Personalização" },
    { id: 3, name: "Confirmação Profile" },
    { id: 4, name: "Pain" },
    { id: 5, name: "Agitate" },
    { id: 6, name: "Solution" },
    { id: 7, name: "Loading" },
    { id: 8, name: "Form" },
    { id: 9, name: "PreChat" },
    { id: 10, name: "WhatsApp Chat" },
    { id: 11, name: "Calendar" },
    { id: 12, name: "Result" },
    { id: 13, name: "Features" },
    { id: 14, name: "Emergency" },
    { id: 15, name: "Social Proof" },
    { id: 16, name: "CTA" },
  ];

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão de debug */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Debug Navigator"
      >
        <Settings className="w-4 h-4" />
      </motion.button>

      {/* Modal de navegação */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-60"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 z-70 max-h-96 overflow-y-auto w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Debug Navigator</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Etapa atual: {currentStep} - {steps.find(s => s.id === currentStep)?.name}
              </p>
              
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`p-2 text-left rounded text-sm transition-colors ${
                      currentStep === step.id
                        ? 'bg-purple-100 text-purple-800 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-mono text-xs text-gray-500 mr-2">
                      {step.id.toString().padStart(2, '0')}
                    </span>
                    {step.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
