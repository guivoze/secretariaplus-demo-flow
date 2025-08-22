import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { PartyPopper, Star, Quote } from "lucide-react";

export const Step12Result = () => {
  const { nextStep } = useSupabaseDemo();

  const cases = [
    {
      name: "Dra. Alana Ferri",
      specialty: "Harmonização Facial",
      text: "A gente perdia muito paciente pela demora no atendimento. Agora é tudo automático e nossa conversão triplicou!",
      rating: 5
    },
    {
      name: "Dra. Adriana Martins",
      specialty: "Estética Avançada",
      text: "Ela responde igualzinho um humano... Meus pacientes nem percebem que é uma IA. Incrível!",
      rating: 5
    },
    {
      name: "Dra. Tânia Kelly",
      specialty: "Dermatologia Estética",
      text: "Dispensei um time comercial que custava R$ 8mil/mês. A IA faz tudo melhor e 24h por dia.",
      rating: 5
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <CustomCard variant="elevated" className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-3"
          >
            <PartyPopper className="w-6 h-6 text-gray-900" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              Agora: imagina TODOS seus leads atendidos com esta qualidade e agendados sozinhos?
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Isso é tempo de sobra pra você cuidar dos seus pacientes e não se preocupar com atendimento.
            </p>
          </motion.div>

          {/* Cases */}
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="space-y-4"
            >
              <CustomCard variant="bordered" className="p-4 hover:shadow-lg transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-sm font-bold">
                        {caseItem.name.split(' ')[1].charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{caseItem.name}</h4>
                      <p className="text-xs text-gray-600">{caseItem.specialty}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: caseItem.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="w-4 h-4 text-gray-400 absolute -top-1 -left-1" />
                    <p className="text-xs text-gray-700 leading-relaxed pl-3">
                      "{caseItem.text}"
                    </p>
                  </div>
                </div>
              </CustomCard>
            </motion.div>
          ))}

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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