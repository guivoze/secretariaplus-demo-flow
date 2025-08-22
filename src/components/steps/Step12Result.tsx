import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, TrendingUp } from "lucide-react";

export const Step12Result = () => {
  const { nextStep } = useSupabaseDemo();

  const benefits = [
    {
      icon: Clock,
      title: "Tempo livre",
      description: "Suas tardes livres para focar no que importa"
    },
    {
      icon: Users,
      title: "Mais pacientes",
      description: "100% dos leads atendidos instantaneamente"
    },
    {
      icon: TrendingUp,
      title: "Mais faturamento",
      description: "Conversão de leads até 300% maior"
    },
    {
      icon: Calendar,
      title: "Agenda cheia",
      description: "Agendamentos automáticos 24/7"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <CustomCard variant="elevated" className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="relative"
          >
            {/* Background calendar effect */}
            <div className="absolute inset-0 opacity-10">
              <Calendar className="w-full h-48 text-primary" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Agora: imagina <span className="text-primary">TODOS</span> seus leads sendo 
                atendidos com esta qualidade e sendo marcados sozinhos?
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Isso é tempo de sobra pra você cuidar dos seus pacientes e não se preocupar com atendimento.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
              >
                <benefit.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/30"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              📈 Resultados reais dos nossos clientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">+300%</div>
                <div className="text-sm text-muted-foreground">Taxa de conversão</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Atendimento ativo</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Leads atendidos</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <CustomButton
              onClick={nextStep}
              size="lg"
              className="px-12"
            >
              Ver mais benefícios
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};