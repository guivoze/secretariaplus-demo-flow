import { useState } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { CustomInput } from "@/components/ui/custom-input";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";

export const Step7Form = () => {
  const { userData, setUserData, nextStep } = useDemo();
  const [formData, setFormData] = useState({
    nome: userData.nome || '',
    email: userData.email || '',
    whatsapp: userData.whatsapp || '',
    especialidade: userData.especialidade || '',
    faturamento: userData.faturamento || ''
  });

  const especialidades = ['HOF', 'Toxina', 'Preenchimento labial', 'Fios'];
  const faturamentos = [
    'Menos de R$ 50k',
    'R$ 50k - R$ 100k',
    'R$ 100k - R$ 200k',
    'Mais de R$ 200k'
  ];

  const isFormValid = formData.nome && formData.email && formData.whatsapp && 
                     formData.especialidade && formData.faturamento;

  const handleSubmit = () => {
    if (isFormValid) {
      setUserData(formData);
      nextStep();
    }
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{0,5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return value;
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <CustomCard variant="elevated" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl font-bold text-foreground">
              Ótimo! Já conseguimos iniciar o treinamento da sua I.A.
            </h2>
            <p className="text-muted-foreground">
              Precisamos de algumas informações para personalizar ainda mais sua experiência.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <CustomInput
              placeholder="Qual seu nome?"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            />

            <CustomInput
              type="email"
              placeholder="E seu e-mail?"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />

            <CustomInput
              placeholder="Qual seu WhatsApp?"
              value={formData.whatsapp}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                whatsapp: formatWhatsApp(e.target.value) 
              }))}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Qual sua especialidade?</label>
              <div className="grid grid-cols-2 gap-2">
                {especialidades.map((esp) => (
                  <button
                    key={esp}
                    onClick={() => setFormData(prev => ({ ...prev, especialidade: esp }))}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.especialidade === esp
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {esp}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Qual seu faturamento mensal médio?</label>
              <select
                value={formData.faturamento}
                onChange={(e) => setFormData(prev => ({ ...prev, faturamento: e.target.value }))}
                className="w-full p-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none"
              >
                <option value="">Selecione...</option>
                {faturamentos.map((fat) => (
                  <option key={fat} value={fat}>{fat}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CustomButton
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full"
              size="lg"
            >
              BORA!
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};