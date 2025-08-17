import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";

export const Step5Solution = () => {
  const { nextStep } = useDemo();

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <CustomCard variant="elevated" className="text-center space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-foreground leading-relaxed"
          >
            E por isso... treinamos nossa I.A para ser uma <span className="font-bold text-primary">vendedora de consultas nata</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="my-8"
          >
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-foreground">
              Interessante, né?
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pra você testar na íntegra e ver como ela fará com seus pacientes, a I.A precisa entender você primeiro.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <CustomButton
              onClick={nextStep}
              size="lg"
              className="px-12"
            >
              BORA!
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};