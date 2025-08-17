import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { MessageCircle, User, Bot } from "lucide-react";

export const Step9PreChat = () => {
  const { nextStep } = useDemo();

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <CustomCard variant="elevated" className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground">
              Tá na hora de testar!
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-xl text-foreground leading-relaxed">
              Finja que você é um lead interessado ou paciente e tente agendar uma consulta. 
              Coloque objeções, aja como um paciente típico seu faria!
            </p>

            <CustomCard variant="bordered" className="bg-warning/10 border-warning">
              <p className="text-lg font-medium text-foreground">
                ⚠️ Lembre-se, isto é apenas uma prévia. Na versão completa, 
                tudo será personalizado do seu jeitinho.
              </p>
            </CustomCard>

            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <User className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Você como<br/>Paciente</p>
              </div>
              <div className="text-2xl text-muted-foreground">VS</div>
              <div className="text-center">
                <Bot className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">I.A como<br/>Secretária</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CustomButton
              onClick={nextStep}
              size="lg"
              className="px-12"
            >
              Ir para o chat
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};