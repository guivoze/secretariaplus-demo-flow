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
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g fill="none" fillRule="evenodd">
            <g fill="#f5f5f5" fillOpacity="0.4">
              <circle cx="20" cy="20" r="1"/>
            </g>
          </g>
        </svg>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10 max-h-[calc(100vh-2rem)]"
      >
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
          {/* Hero Image Area */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            <div className="absolute inset-0 mix-blend-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0 0h100v100H0z" fill="#ffffff" fillOpacity="0.1"/>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-xl sm:text-2xl font-bold text-primary">SP</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center space-y-3"
            >
              <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                [Grátis] Teste sua Nova Secretária de I.A. em 1 Min.
              </h1>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                Treinamos ela com base no seu Insta automaticamente ✨
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-3"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Insira seu @ profissional aqui embaixo:
                </p>
              </div>

              <CustomInput
                prefix="@"
                placeholder="drabelguerra"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.toLowerCase())}
                className="text-center"
                style={{ textTransform: 'lowercase' }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                inputMode="text"
              />

              <CustomButton
                onClick={handleSubmit}
                disabled={!instagram.trim()}
                className="w-full text-white bg-black hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                size="md"
              >
                Testar Minha I.A Agora 🚀
              </CustomButton>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center"
            >
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                A análise do seu instagram é feita apenas com dados públicos e sua personalizacão na demonstracão.
              </p>
            </motion.div>

            {/* Live counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-foreground">
                  {liveCount} clínicas testando agora
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};