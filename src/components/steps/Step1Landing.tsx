import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomInput } from "@/components/ui/custom-input";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";

export const Step1Landing = () => {
  const { userData, setUserData, nextStep } = useDemo();
  const [instagram, setInstagram] = useState(userData.instagram || '');
  const [liveCount, setLiveCount] = useState(243);

  // Increment live count every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (instagram.trim()) {
      const cleanInstagram = instagram.trim();
      setUserData({ 
        instagram: cleanInstagram,
        instagramRequestTime: Date.now()
      });
      
      // Fire-and-forget webhook to N8N
      fetch('https://n8nsplus.up.railway.app/webhook/get_insta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagram: cleanInstagram })
      }).then(response => response.json())
        .then(data => {
          if (data.perfil) {
            // Save real Instagram data to localStorage
            const instagramData = {
              hasInstagramData: true,
              realProfilePic: data.foto_perfil,
              realPosts: [data.post1, data.post2, data.post3],
              aiInsights: {
                name: data.name,
                where: data.where,
                procedure1: data.procedure1,
                procedure2: data.procedure2,
                procedure3: data.procedure3,
                rapport: data.rapport
              }
            };
            localStorage.setItem('instagram-data', JSON.stringify(instagramData));
            
            // Start preloading images immediately after saving data
            const imagesToPreload = [
              data.foto_perfil,
              data.post1,
              data.post2,
              data.post3
            ].filter(Boolean);
            
            console.log('Starting immediate image preload:', imagesToPreload);
            imagesToPreload.forEach(url => {
              const img = new Image();
              img.onload = () => console.log('Preloaded:', url);
              img.onerror = () => console.log('Failed to preload:', url);
              img.src = url;
            });
          }
        })
        .catch(() => {
          // Silent fail - continue with mock data
        });
      
      nextStep();
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <CustomCard variant="elevated" className="text-center space-y-4 p-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-2">
              SecretáriaPlus
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          {/* Main content */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground leading-tight">
              Teste gratuitamente e veja a I.A agendar consultas no piloto automático. Preparado?
            </h2>
            
            <p className="text-muted-foreground">
              Insira o @ do instagram profissional para iniciar
            </p>

            <div className="space-y-4">
              <CustomInput
                prefix="@"
                placeholder="digita o @ certinho, tem uma surpresa pra você. 🎁"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="text-center"
              />

              <CustomButton
                onClick={handleSubmit}
                disabled={!instagram.trim()}
                className="w-full"
                size="lg"
              >
                QUERO TESTAR AGORA 🚀
              </CustomButton>
            </div>
          </div>

          {/* Live counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            <span className="text-primary font-semibold animate-pulse-slow">
              {liveCount}
            </span>{" "}
            clínicas testando agora
          </motion.div>
        </CustomCard>
      </motion.div>
    </div>
  );
};