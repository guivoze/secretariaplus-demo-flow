import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export const Step11Calendar = () => {
  const { nextStep, userData } = useDemo();

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const appointments = [
    { time: '09:00', patient: '', available: true },
    { time: '10:00', patient: '', available: true },
    { time: '11:00', patient: '', available: true },
    { time: '14:00', patient: '', available: true },
    { time: '15:35', patient: 'Ana Cláudia - Preenchimento', available: false, isNew: true },
    { time: '16:00', patient: '', available: true },
    { time: '17:00', patient: '', available: true },
  ];

  return (
    <div className="min-h-screen gradient-subtle p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <CustomCard variant="elevated" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
              <Calendar className="w-6 h-6 text-gray-800" />
              20 de Agosto, 2025
            </h2>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-foreground text-center">
                Agendamentos do Dia
              </h3>
              
              <div className="space-y-2">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.time}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      appointment.isNew
                        ? 'border-gray-800 bg-gray-100 animate-pulse'
                        : appointment.available
                        ? 'border-dashed border-muted-foreground/50 bg-muted/30'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{appointment.time}</span>
                      {appointment.isNew && (
                        <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded-full font-semibold">
                          NOVO!
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      appointment.available 
                        ? 'text-muted-foreground italic' 
                        : 'text-foreground'
                    }`}>
                      {appointment.available ? 'Disponível' : appointment.patient}
                    </p>
                  </motion.div>
                ))}
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-100 border border-gray-300 rounded-xl p-4"
          >
            <h4 className="font-semibold text-foreground mb-2">
              🎉 Agendamento realizado automaticamente!
            </h4>
            <p className="text-sm text-muted-foreground">
              A I.A acabou de agendar Ana Cláudia para {userData.especialidade || 'preenchimento'} 
              no dia 20/08 às 15:35. Tudo sem sua intervenção!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
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