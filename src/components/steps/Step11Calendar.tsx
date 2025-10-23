import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export const Step11Calendar = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { nextStep, userData, appointment } = useSupabaseDemo();
  console.log('[calendar-ui] appointment from context:', appointment);


  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const selectedTime = appointment?.displayTime || '15:35';
  const selectedPatient = appointment?.patientName || 'Paciente';
  const selectedProcedure = appointment?.procedure || (userData.especialidade || 'preenchimento');
  const baseDate = appointment?.dateISO ? new Date(appointment.dateISO) : new Date();
  const headerDate = appointment?.displayDate || new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(baseDate);
  const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(baseDate);

  // Função para gerar os 4 horários inteligentemente
  const generateSmartAppointments = () => {
    // Horários disponíveis de 8h às 19h (intervalos de 1h)
    const allTimes = [];
    for (let hour = 8; hour <= 19; hour++) {
      allTimes.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    // Converter selectedTime para minutos para comparação
    const [selectedHour, selectedMin] = selectedTime.split(':').map(Number);
    const selectedMinutes = selectedHour * 60 + selectedMin;
    
    // Encontrar o índice mais próximo no array de horários
    let selectedIndex = allTimes.findIndex(time => {
      const [hour] = time.split(':').map(Number);
      return hour * 60 >= selectedMinutes;
    });
    
    // Se não achou, usar o último horário
    if (selectedIndex === -1) selectedIndex = allTimes.length - 1;
    
    // Calcular posições para manter o horário agendado na 2ª ou 3ª posição
    let startIndex;
    let selectedPositionInFour; // Posição do agendado nos 4 horários (0,1,2,3)
    
    if (selectedIndex <= 1) {
      // Se for muito cedo, colocar na 2ª posição (índice 1)
      startIndex = 0;
      selectedPositionInFour = selectedIndex;
    } else if (selectedIndex >= allTimes.length - 2) {
      // Se for muito tarde, colocar na 3ª posição (índice 2)
      startIndex = allTimes.length - 4;
      selectedPositionInFour = selectedIndex - startIndex;
    } else {
      // Caso normal, colocar na 2ª posição (índice 1)
      startIndex = selectedIndex - 1;
      selectedPositionInFour = 1;
    }
    
    // Garantir que não saia dos limites
    startIndex = Math.max(0, Math.min(allTimes.length - 4, startIndex));
    
    // Pegar 4 horários consecutivos da grade
    const fourTimes = allTimes.slice(startIndex, startIndex + 4);
    
    // Criar os appointments - substituir apenas UMA posição pelo horário real
    return fourTimes.map((time, index) => {
      const isSelectedSlot = index === selectedPositionInFour;
      const isEdge = index === 0 || index === 3; // Pontas (40% opacity)
      
      if (isSelectedSlot) {
        // Este é o slot que será substituído pelo horário real agendado
        return {
          time: selectedTime,
          patient: `${selectedPatient} - ${selectedProcedure}`,
          available: false,
          isNew: true,
          isEdge: isEdge
        };
      } else {
        // Horários normais da grade (disponíveis)
        return {
          time: time,
          patient: '',
          available: true,
          isNew: false,
          isEdge: isEdge
        };
      }
    });
  };

  const appointments = generateSmartAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center p-4 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg pb-8"
      >
        <CustomCard variant="elevated" className="space-y-4 p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h2 className="title-sub text-foreground flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5 text-gray-800" />
              {headerDate}
            </h2>
            <p className="text-small text-muted-foreground mt-1 capitalize">{weekday}</p>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h3 className="text-content-medium text-foreground text-center">
                Agendamentos do Dia
              </h3>

              <div className="space-y-2">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={`${appointment.time}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      appointment.isEdge ? 'opacity-60' : ''
                    } ${
                      appointment.isNew
                        ? 'border-gray-800 bg-gray-100 animate-pulse'
                        : appointment.available
                        ? 'border-dashed border-muted-foreground/50 bg-muted/30'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-content-medium text-foreground">{appointment.time}</span>
                      {appointment.isNew && (
                        <span className="text-small bg-gray-800 text-white px-2 py-1 rounded-full font-semibold">
                          NOVO!
                        </span>
                      )}
                    </div>
                    <p className={`text-small ${
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
            <h4 className="text-content-medium text-foreground mb-2">
              🎉 Agendamento realizado automaticamente!
            </h4>
            <p className="text-small text-muted-foreground">
              A I.A acabou de agendar {selectedPatient} para {selectedProcedure}&nbsp; 
              no dia {headerDate} às {selectedTime}. <strong>Tudo sem sua intervenção!</strong>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center pt-2"
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