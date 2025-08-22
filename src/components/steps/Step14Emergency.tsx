import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const Step14Emergency = () => {
  const { nextStep } = useSupabaseDemo();

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <CustomCard variant="elevated" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-left space-y-3"
          >
            <AlertTriangle className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              Ahh... mas e se algum paciente relatar complicação ou intercorrência?
            </h1>
            <p className="text-sm text-gray-500 font-normal">
              Tranquilo!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-4"
          >
            {/* Toast notification placeholder */}
            <div className="bg-gray-100 rounded-lg p-8 border border-gray-200 flex items-center justify-center min-h-[120px]">
              <div className="text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
                <div className="text-xs text-gray-500 font-mono">TOAST_NOTIFICATION_PLACEHOLDER</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <p className="text-gray-700 leading-relaxed">
              Você recebe uma <span className="font-bold text-red-500">notificação automática</span> no app, 
              e já cai direto na conversa para lidar na íntegra!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <CustomButton
              onClick={nextStep}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-lg font-medium text-lg"
            >
              Continuar
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};