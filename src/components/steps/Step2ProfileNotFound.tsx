import { CustomButton } from "@/components/ui/custom-button";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";

export const Step2ProfileNotFound = () => {
  const { userData, resetDemo } = useSupabaseDemo();

  const handleTryAgain = () => {
    // Limpa o cache do resultado da query
    localStorage.removeItem('profile-query-result');
    // Reseta a demo para voltar ao início
    resetDemo();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g fill="none" fillRule="evenodd">
            <g fill="#f5f5f5" fillOpacity="0.4">
              <circle cx="20" cy="20" r="1" />
            </g>
          </g>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
          {/* Header Area */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-orange-500/20 to-red-500/10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-2xl shadow-lg flex items-center justify-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                Ops! Perfil não encontrado 🔍
              </h1>

              <div className="bg-muted/50 rounded-2xl p-4 space-y-2">
                <p className="text-muted-foreground leading-relaxed">
                  Não encontramos nenhum perfil público do Instagram com o nome:
                </p>
                <div className="bg-background rounded-lg px-4 py-2 inline-block">
                  <p className="font-semibold text-foreground">@{userData.instagram}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground text-left bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-4">
                <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Possíveis causas:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>O perfil está como privado ou não existe</li>
                  <li>Você digitou o nome de usuário incorreto</li>
                  <li>O perfil foi recentemente criado ou alterado</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-3"
            >
              <CustomButton
                onClick={handleTryAgain}
                size="md"
                className="w-full text-white bg-black hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-md text-center py-[13px]"
              >
                Tentar Novamente
              </CustomButton>

              <p className="text-xs text-center text-muted-foreground">
                Você será levado de volta ao início para digitar o perfil correto
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
