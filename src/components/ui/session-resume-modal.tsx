import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { motion, AnimatePresence } from "framer-motion";

interface SessionResumeModalProps {
  isOpen: boolean;
  instagramHandle: string;
  onResume: () => void;
  onNewTest: () => void;
}

export const SessionResumeModal = ({ 
  isOpen, 
  instagramHandle, 
  onResume, 
  onNewTest 
}: SessionResumeModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <CustomCard variant="elevated" className="text-center space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-foreground"
              >
                Teste anterior encontrado!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 text-foreground"
              >
                <p className="text-lg leading-relaxed">
                  Encontramos um teste anterior feito com{" "}
                  <span className="font-semibold text-primary">@{instagramHandle}</span>.
                </p>
                
                <p className="text-sm text-muted-foreground">
                  Quer continuar de onde parou ou fazer um novo teste?
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <CustomButton
                  onClick={onResume}
                  className="flex-1"
                  size="lg"
                >
                  Continuar teste anterior
                </CustomButton>
                
                <CustomButton
                  onClick={onNewTest}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Fazer novo teste
                </CustomButton>
              </motion.div>
            </CustomCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};