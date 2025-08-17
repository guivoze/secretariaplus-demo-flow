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
            className="flex items-center justify-between"
          >
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-8 h-8 text-primary" />
              Agosto 2025
            </h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-muted">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-7 gap-1 mb-4">
                {days.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day) => (
                  <div
                    key={day}
                    className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                      day === 20
                        ? 'bg-primary text-black font-bold'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Appointments for selected day */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-foreground">
                20 de Agosto - Agendamentos
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
                        ? 'border-primary bg-primary/10 animate-pulse'
                        : appointment.available
                        ? 'border-dashed border-muted-foreground/50 bg-muted/30'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{appointment.time}</span>
                      {appointment.isNew && (
                        <span className="text-xs bg-primary text-black px-2 py-1 rounded-full font-semibold">
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-primary/10 border border-primary rounded-xl p-4"
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