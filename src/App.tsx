import { DemoProvider, useDemo } from "@/hooks/useDemo";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

// Import step components
import { Step1Landing } from "@/components/steps/Step1Landing";
import { Step2Modal } from "@/components/steps/Step2Modal";
import { Step3Pain } from "@/components/steps/Step3Pain";
import { Step4Agitate } from "@/components/steps/Step4Agitate";
import { Step5Solution } from "@/components/steps/Step5Solution";
import { Step6Loading } from "@/components/steps/Step6Loading";

const DemoContent = () => {
  const { currentStep, resetDemo } = useDemo();

  const calculateProgress = (step: number) => {
    return Math.min((step / 15) * 100, 100); // 16 steps total (0-15)
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Landing />;
      case 1:
        return <Step2Modal />;
      case 2:
        return <Step3Pain />;
      case 3:
        return <Step4Agitate />;
      case 4:
        return <Step5Solution />;
      case 5:
        return <Step6Loading />;
      default:
        return (
          <div className="min-h-screen gradient-bg flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Em desenvolvimento...</h1>
              <p className="text-muted-foreground mb-6">Etapa {currentStep + 1} em breve!</p>
              <button 
                onClick={resetDemo}
                className="btn-primary px-6 py-3 rounded-2xl"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Progress Bar */}
      {currentStep > 0 && <ProgressBar progress={calculateProgress(currentStep)} />}
      
      {/* Current Step */}
      {renderCurrentStep()}
      
      {/* Global Reset Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetDemo}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full shadow-card hover:bg-gray-700 transition-all z-50 flex items-center gap-2"
        title="Reiniciar demonstração"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="hidden sm:inline">Reiniciar</span>
      </motion.button>
    </div>
  );
};

const App = () => {
  return (
    <DemoProvider>
      <DemoContent />
    </DemoProvider>
  );
};

export default App;