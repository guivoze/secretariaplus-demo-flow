import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";
import { Star, Heart, Quote } from "lucide-react";

export const Step15SocialProof = () => {
  const { nextStep } = useDemo();

  const testimonials = [
    {
      name: "Dra. Alana Ferri",
      specialty: "Harmonização Facial",
      text: "A gente perdia muito paciente pela demora no atendimento. Agora é tudo automático e nossa conversão triplicou!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Dra. Adriana Martins",
      specialty: "Estética Avançada",
      text: "Ela responde igualzinho um humano... Meus pacientes nem percebem que é uma IA. Incrível!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Dra. Tânia Kelly",
      specialty: "Dermatologia Estética",
      text: "Dispensei um time comercial que custava R$ 8mil/mês. A IA faz tudo melhor e 24h por dia.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Dra. Fernanda Rabelo",
      specialty: "Cirurgia Plástica",
      text: "Investimos mais de 20 mil em outras soluções que não funcionaram. Essa aqui vale cada centavo!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1594824389862-a70b1c28d2b4?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        <CustomCard variant="elevated" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-primary">
                SecretáriaPlus
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Tudo que você já imaginar, a gente já pensou.
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Vida de profissional da saúde é <span className="font-semibold">EXTREMAMENTE corrida</span>, 
              e queremos que seu caminho seja fácil.
            </p>

            <div className="flex items-center justify-center gap-2 text-primary">
              <Heart className="w-5 h-5 fill-current" />
              <p className="text-sm text-muted-foreground">
                com o mínimo de configuração técnica possível pra liberar você cuidar do que mais importa: 
                <span className="font-semibold text-primary"> seus pacientes</span>
              </p>
              <Heart className="w-5 h-5 fill-current" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <CustomCard variant="bordered" className="p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.specialty}</p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <Quote className="w-6 h-6 text-primary/30 absolute -top-2 -left-1" />
                      <p className="text-sm text-foreground leading-relaxed pl-4">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                </CustomCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/30 text-center"
          >
            <h3 className="text-xl font-bold text-foreground mb-3">
              🏆 Mais de 500 clínicas confiam em nós
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfação dos clientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">2.5M+</div>
                <div className="text-sm text-muted-foreground">Conversas atendidas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">R$ 50M+</div>
                <div className="text-sm text-muted-foreground">Em vendas geradas</div>
              </div>
            </div>
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