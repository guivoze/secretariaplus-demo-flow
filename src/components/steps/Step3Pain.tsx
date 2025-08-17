import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
export const Step3Pain = () => {
  const {
    nextStep
  } = useDemo();
  return <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <motion.div initial={{
      opacity: 0,
      y: 30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="w-full max-w-2xl">
        <CustomCard variant="elevated" className="text-center space-y-8">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-3xl font-bold text-foreground">
            A gente sabe como é frustrante...
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-lg text-foreground leading-relaxed">
            Investir na técnica, posicionamento, entregar o melhor resultado clínico... mas deixar de crescer por incompetência de uma secretária no WhatsApp
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.3
        }}>
            <CustomCard variant="bordered" className="bg-primary/10 border-primary">
              <p className="text-xl font-semibold text-foreground">
                72% dos seus pacientes ou leads VÃO embora só por que você demora mais de 3 minutos para responder
              </p>
            </CustomCard>
          </motion.div>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="font-semibold text-slate-950 text-lg">
            isso é praticamente rasgar $$$
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }}>
            <CustomButton onClick={nextStep} size="lg" className="px-12">
              CONTINUAR
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};