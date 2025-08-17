import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MessageSquare, Shield } from "lucide-react";

export const Step14Emergency = () => {
  const { nextStep } = useDemo();

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <CustomCard variant="elevated" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-4"
          >
            <Shield className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              Ahh.. mas e se o paciente reclamar de dor? E se tiver uma intercorrência?
            </h1>
            <p className="text-xl text-primary font-semibold">
              Tranquilo!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative"
          >
            {/* Mobile notification mockup */}
            <div className="max-w-sm mx-auto">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="bg-red-500 text-white rounded-t-xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">🚨 Emergência Médica</h3>
                    <p className="text-xs opacity-90">from SecretáriaPlus</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-b-xl p-4 shadow-2xl border-l-4 border-red-500"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  URGENTE: Mariana Neves • (11) 91283-2382
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  relatou uma complicação/emergência. Clique para abrir a conversa.
                </p>
                <div className="flex gap-2">
                  <button className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Ligar
                  </button>
                  <button className="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Chat
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center space-y-4"
          >
            <p className="text-lg text-foreground leading-relaxed">
              Você recebe uma <span className="font-bold text-red-500">notificação automática</span> no app, 
              e já cai direto na conversa para lidar na íntegra!
            </p>

            <CustomCard variant="bordered" className="bg-primary/10 border-primary p-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>A I.A é inteligente:</strong> Quando detecta palavras como "dor", "problema", 
                "complicação" ou "urgente", ela automaticamente te notifica e pausa o atendimento 
                até você assumir o controle.
              </p>
            </CustomCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center"
          >
            <CustomButton
              onClick={nextStep}
              size="lg"
              className="px-12"
            >
              Continuar
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};