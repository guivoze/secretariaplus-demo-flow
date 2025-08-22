import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
export const Step3Pain = () => {
  const {
    nextStep
  } = useSupabaseDemo();
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
        }} className="title-section text-foreground">
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
        }} className="text-content-medium text-foreground leading-relaxed">
            Investir na técnica, posicionamento, entregar o melhor resultado clínico... mas deixar de crescer por incompetência de uma secretária no WhatsApp
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <CustomCard variant="bordered" className="bg-primary/10 border-primary">
              <p className="title-sub text-foreground">
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
        }} className="text-content-medium font-semibold text-slate-950">
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
              Bora ver na prática?
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>;
};