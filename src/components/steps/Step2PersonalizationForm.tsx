import { useState } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { CustomInput } from "@/components/ui/custom-input";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";

const specialties = [
  "HOF",
  "Odonto", 
  "Dermatologia",
  "Cir. Plástica",
  "Estética geral (salão, micro)",
  "Maquiagem"
];

export const Step2PersonalizationForm = () => {
  const { userData, setUserData, nextStep } = useDemo();
  const [formData, setFormData] = useState({
    nome: userData.nome || "",
    especialidade: userData.especialidade || ""
  });

  const isFormValid = formData.nome.trim() && formData.especialidade;

  const handleSubmit = () => {
    if (!isFormValid) return;

    setUserData({
      nome: formData.nome.trim(),
      especialidade: formData.especialidade
    });

    // Proceed to profile confirmation step
    // Webhook will be called only after profile confirmation
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <CustomCard variant="elevated" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Pra gente personalizar seu teste 🤩
            </h2>
          </div>

          <div className="space-y-4">
            <CustomInput
              label="Qual seu nome?"
              placeholder="Digite seu nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Qual sua área de atuação principal?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {specialties.map((specialty) => (
                  <motion.button
                    key={specialty}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, especialidade: specialty })}
                    className={`
                      p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                      ${formData.especialidade === specialty
                        ? 'border-gray-800 bg-gray-50 text-foreground'
                        : 'border-gray-200 hover:border-gray-400 text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {specialty}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <CustomButton
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full"
            size="lg"
          >
            Começar →
          </CustomButton>
        </CustomCard>
      </motion.div>
    </div>
  );
};