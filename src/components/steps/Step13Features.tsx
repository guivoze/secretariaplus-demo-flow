import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { Database, Bot, MessageCircle, Sparkles } from "lucide-react";

export const Step13Features = () => {
  const { nextStep } = useDemo();

  const features = [
    {
      icon: Database,
      title: "CRM que se alimenta sozinho",
      description: "Você terá um CRM que se alimenta sozinho, e arrasta os cards pra você 🤯 (pra você que não tem saco pra gerenciar ferramenta)",
      highlight: "Automatização Total"
    },
    {
      icon: Bot,
      title: "100% Humanizada",
      description: "Ela ouve áudios, responde quantos pacientes precisar, tem um leve delay para favorecer a ideia de humanização... - Muitos dos nossos clientes usam, e as pessoas nem percebem que é uma IA 🤫",
      highlight: "Indistinguível de Humano"
    },
    {
      icon: MessageCircle,
      title: "Follow-up Inteligente",
      description: "follow up: se o paciente te der um vácuo, a própria ia da aquela cutucadinha pra ele voltar o papo e prosseguir",
      highlight: "Nunca Perde um Lead"
    }
  ];

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <CustomCard variant="elevated" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-4"
          >
            <Sparkles className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Além de tudo isso...
            </h1>
            <p className="text-lg text-muted-foreground">
              Recursos que vão revolucionar seu atendimento
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.2 }}
              >
                <CustomCard 
                  variant="bordered" 
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-foreground">
                          {feature.title}
                        </h3>
                        <span className="bg-primary text-black px-3 py-1 rounded-full text-xs font-semibold">
                          {feature.highlight}
                        </span>
                      </div>
                      
                      <p className="text-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CustomCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/30 text-center"
          >
            <h3 className="text-xl font-bold text-foreground mb-3">
              🚀 E muito mais...
            </h3>
            <p className="text-muted-foreground">
              Relatórios automáticos, integração com agenda, backup de conversas, 
              dashboard de métricas e suporte técnico especializado.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
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