import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { MessageCircle, User, Bot } from "lucide-react";

export const Step9PreChat = () => {
  const { nextStep } = useDemo();

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm relative">
      {/* Background placeholder image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(https://via.placeholder.com/1920x1080/E5C197/000000?text=Clinica+Background)`
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <CustomCard variant="elevated" className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <MessageCircle className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">
              Tá na hora de testar!
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground leading-relaxed">
              Finja que você é um lead interessado ou paciente e tente agendar uma consulta. 
              Coloque objeções, aja como um paciente típico seu faria!
            </p>

            <CustomCard variant="bordered" className="bg-gray-50 border-gray-300">
              <p className="text-sm font-medium text-foreground">
                ⚠️ Lembre-se, isto é apenas uma prévia. Na versão completa, 
                tudo será personalizado do seu jeitinho.
              </p>
            </CustomCard>

            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <User className="w-6 h-6 text-gray-800 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Você como<br/>Paciente</p>
              </div>
              <div className="text-lg text-muted-foreground">VS</div>
              <div className="text-center">
                <Bot className="w-6 h-6 text-gray-800 mx-auto mb-2" />
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