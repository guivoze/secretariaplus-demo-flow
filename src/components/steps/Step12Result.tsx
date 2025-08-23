import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
import { PartyPopper, Star, Quote } from "lucide-react";

export const Step12Result = () => {
  const { nextStep } = useSupabaseDemo();

  const cases = [
    {
      name: "Dra. Fernanda Rabelo",
      specialty: "Cirurgia Plástica",
      text: "Investimos por aqui mais de 20 mil em tráfego e a secretaria plus arrebenta com os leads",
      rating: 5,
      image: "/imgs/fernanda.webp"
    },
    {
      name: "Dra. Adriana Martinuzzo",
      specialty: "Estética Avançada",
      text: "Ela responde igualzinho um humano e gera muita empatia com os pacientes",
      rating: 5,
      image: "/imgs/adriana.webp"
    },
    {
      name: "Dra. Danielle Freitas",
      specialty: "Dermatologia Estética",
      text: "tirou um peso das minhas costas",
      rating: 5,
      image: "/imgs/danif.webp"
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
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src={caseItem.image} 
                        alt={caseItem.name}
                        className="w-full h-full object-cover"
                      />
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