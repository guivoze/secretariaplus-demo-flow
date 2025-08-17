import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
export const Step2Modal = () => {
  const {
    nextStep
  } = useDemo();
  return <div className="min-h-screen bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.3
    }} className="w-full max-w-lg">
        <CustomCard variant="elevated" className="text-center space-y-6">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-2xl font-bold text-foreground">Bora ver na prática?</motion.h2>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="space-y-4 text-foreground">
            <p className="text-lg leading-relaxed">Em instantes, você poderá simular uma conversa no WhatsApp: você faz o papel do paciente e a I.A responde como se fosse sua clínica.</p>

            <p className="text-sm text-muted-foreground">Veja a qualidade das respostas, condução de vendas e o agendamento automático.</p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }}>
            <CustomButton onClick={nextStep} className="w-full" size="lg">
              BORA!
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};