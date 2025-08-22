import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";

export const Step4Agitate = () => {
  const { nextStep } = useSupabaseDemo();

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
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
            className="text-content-medium text-foreground leading-relaxed"
          >
            Mas... se o problema maior fosse só o tempo de resposta, você colocaria um bot pra atender os leads e resolveria o problema.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="my-8"
          >
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-content-medium text-foreground leading-relaxed font-medium"
          >
            Só que.. você <span className="font-bold text-primary">SABE</span> o quanto um paciente de alto valor <span className="font-bold text-primary">PRECISA</span> de um atendimento vip e humano - respeitando um script persuasivo para maximizar seus agendamentos.
          </motion.p>

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
              CONTINUAR
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};