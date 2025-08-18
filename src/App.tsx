import React from "react";
import { SupabaseDemoProvider, useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

// Import step components
import { Step1Landing } from "@/components/steps/Step1Landing";
import { Step2Modal } from "@/components/steps/Step2Modal";
import { Step2PersonalizationForm } from "@/components/steps/Step2PersonalizationForm";
import { Step2ProfileConfirmation } from "@/components/steps/Step2ProfileConfirmation";
import { Step3Pain } from "@/components/steps/Step3Pain";
import { Step4Agitate } from "@/components/steps/Step4Agitate";
import { Step5Solution } from "@/components/steps/Step5Solution";
import { Step6Loading } from "@/components/steps/Step6Loading";
import { Step7Form } from "@/components/steps/Step7Form";
import { Step9PreChat } from "@/components/steps/Step9PreChat";
import { Step10WhatsApp } from "@/components/steps/Step10WhatsApp";
import { Step11Calendar } from "@/components/steps/Step11Calendar";
import { Step12Result } from "@/components/steps/Step12Result";
import { Step13Features } from "@/components/steps/Step13Features";
import { Step14Emergency } from "@/components/steps/Step14Emergency";
import { Step15SocialProof } from "@/components/steps/Step15SocialProof";
import { Step16CTA } from "@/components/steps/Step16CTA";

const DemoContent = () => {
  const { currentStep, resetDemo, isLoading } = useSupabaseDemo();

  const calculateProgress = (step: number) => {
    return Math.min((step / 15) * 100, 100); // 16 steps total (0-15)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando sessão...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Landing />;
      case 1:
        return <Step2Modal />;
      case 2:
        return <Step2PersonalizationForm />;
      case 3:
        return <Step2ProfileConfirmation />;
      case 4:
        return <Step3Pain />;
      case 5:
        return <Step4Agitate />;
      case 6:
        return <Step5Solution />;
      case 7:
        return <Step6Loading />;
      case 8:
        return <Step7Form />;
      case 9:
        return <Step9PreChat />;
      case 10:
        return <Step10WhatsApp />;
      case 11:
        return <Step11Calendar />;
      case 12:
        return <Step12Result />;
      case 13:
        return <Step13Features />;
      case 14:
        return <Step14Emergency />;
      case 15:
        return <Step15SocialProof />;
      case 16:
        return <Step16CTA />;
      default:
        return (
          <div className="min-h-screen gradient-bg flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-bold mb-4">Demo concluída!</h1>
              <p className="text-muted-foreground mb-6">Obrigado por testar a SecretáriaPlus!</p>
              <button 
                onClick={resetDemo}
                className="btn-primary px-6 py-3 rounded-2xl"
              >
                Testar novamente
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
    <SupabaseDemoProvider>
      <DemoContent />
    </SupabaseDemoProvider>
  );
};

export default App;