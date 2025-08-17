import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";

export const Step8Confirmation = () => {
  const { userData, nextStep } = useDemo();

  const procedureImages = [
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1594824389862-a70b1c28d2b4?w=200&h=200&fit=crop"
  ];

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <CustomCard variant="elevated" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6"
          >
            {procedureImages.map((img, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden shadow-card"
              >
                <img
                  src={img}
                  alt={`Procedimento ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-foreground">
              Certo... então você é <span className="text-primary">{userData.nome}</span>, 
              atende em sua clínica, e parece que faz bastante{" "}
              <span className="text-primary">{userData.especialidade}</span>? 👀
            </h2>

            <p className="text-lg text-foreground">
              Alias, seu perfil é incrível! Vi que você tem ótimos resultados.
            </p>

            <p className="text-sm text-muted-foreground">
              Quer ajustar algo? Clique nos campos e edite.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <span className="text-sm text-muted-foreground">Nome:</span>
                <p className="font-medium text-foreground">{userData.nome}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <span className="text-sm text-muted-foreground">Especialidade:</span>
                <p className="font-medium text-foreground">{userData.especialidade}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <span className="text-sm text-muted-foreground">Email:</span>
                <p className="font-medium text-foreground">{userData.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <span className="text-sm text-muted-foreground">WhatsApp:</span>
                <p className="font-medium text-foreground">{userData.whatsapp}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CustomButton
              onClick={nextStep}
              className="w-full"
              size="lg"
            >
              Isso mesmo! Pode Prosseguir.
            </CustomButton>
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};