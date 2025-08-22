import React from "react";
import { SupabaseDemoProvider, useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RotateCcw, ChevronLeft } from "lucide-react";
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
	const { 
		currentStep, 
		resetDemo, 
		prevStep,
		isLoading, 
		showResumeModal, 
		foundPreviousSession, 
		resumePreviousSession, 
		startNewTest,
		closeResumeModal // ADDED
	} = useSupabaseDemo();

	const calculateProgress = (step: number) => {
		// Total lógico de steps do app (0..15)
		const totalSteps = 16;
		// A barra será exibida até o step 8 (inclusive)
		const lastVisibleIndex = Math.min(8, totalSteps - 1);
		const count = lastVisibleIndex + 1; // quantidade de posições (0..lastVisibleIndex)

		// Se o total visível for pequeno, fazemos uma progressão linear até 75%.
		// Caso contrário, aplicamos front‑loading (0..5) e distribuímos o restante até 100% no último visível.
		let milestones: number[] = [];
		if (count <= 2) {
			milestones = [0];
			if (count === 2) milestones.push(75);
		} else if (count <= 6) {
			// Linear até 75% para caber nos visíveis
			for (let i = 0; i < count; i++) {
				milestones.push((75 / (count - 1)) * i);
			}
		} else {
			// Base front‑loading até 75% nos primeiros 6 índices (0..5)
			const base = [0, 30, 50, 62, 70, 75];
			milestones = base.slice();
			const remaining = count - base.length; // posições 6..lastVisibleIndex
			const inc = remaining > 0 ? (25 / remaining) : 25;
			for (let k = 0; k < remaining; k++) {
				milestones.push(Math.min(75 + inc * (k + 1), 100));
			}
		}

		const clamped = Math.max(0, Math.min(step, lastVisibleIndex));
		return Math.min(milestones[clamped] || 0, 100);
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
			default:
				return <Step16CTA />;
		}
	};

	return (
		<div className="min-h-screen h-screen relative overflow-hidden">
			{/* Debug Navigator removido */}
			
			{/* Progress Bar (visível apenas até o step 8) */}
			{currentStep > 0 && currentStep <= 8 && (
				<ProgressBar progress={calculateProgress(currentStep)} />
			)}
			
			{/* Current Step - Com overflow responsivo */}
			<div className="h-full overflow-auto">
				{renderCurrentStep()}
			</div>
			
			{/* Session Resume Modal removido */}
			
			{/* Global Controls: Back and Reset (debug) - Responsivo */}
			<div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 pb-5">
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={prevStep}
					className="bg-gray-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-card hover:bg-gray-700 transition-all flex items-center gap-2 text-small"
					title="Voltar etapa"
				>
					<ChevronLeft className="w-4 h-4" />
					<span className="hidden sm:inline">Voltar</span>
				</motion.button>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={resetDemo}
					className="bg-gray-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-card hover:bg-gray-700 transition-all flex items-center gap-2 text-small"
					title="Reiniciar demonstração"
				>
					<RotateCcw className="w-4 h-4" />
					<span className="hidden sm:inline">Reiniciar</span>
				</motion.button>
			</div>
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