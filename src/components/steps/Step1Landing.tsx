import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomInput } from "@/components/ui/custom-input";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";

export const Step1Landing = () => {
  const { userData, setUserData, nextStep } = useSupabaseDemo();
  const [instagram, setInstagram] = useState(userData.instagram || '');
  const [liveCount, setLiveCount] = useState(243);

  // Increment live count every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (instagram.trim()) {
      const cleanInstagram = instagram.trim();
      setUserData({ 
        instagram: cleanInstagram,
        instagramRequestTime: Date.now()
      });
      
      // Call webhook in background immediately
      fetch('https://n8nsplus.up.railway.app/webhook/query_insta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagram: cleanInstagram })
      }).then(response => response.json())
        .then(data => {
          console.log('Profile query response:', data);
          // Store response for later use
          localStorage.setItem('profile-query-result', JSON.stringify(data));
        })
        .catch(error => console.error('Error querying profiles:', error));
      
      nextStep(); // Goes to Step2Modal
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
                onChange={(e) => setInstagram(e.target.value.toLowerCase())}
                className="text-center"
                style={{ textTransform: 'lowercase' }}
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