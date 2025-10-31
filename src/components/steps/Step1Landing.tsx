import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomInput } from "@/components/ui/custom-input";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";
export const Step1Landing = () => {
  const {
    userData,
    setUserData,
    nextStep
  } = useSupabaseDemo();
  const [instagram, setInstagram] = useState(userData.instagram || '');
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(() => 130 + Math.floor(Math.random() * 91)); // 130..220
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Increment live count every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const delta = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 3) + 1); // -3..+3
        let next = prev + delta;
        if (next < 130) next = 130;
        if (next > 220) next = 220;
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleSubmit = async () => {
    if (instagram.trim() && !isSubmitting) {
      setIsSubmitting(true);
      const cleanInstagram = instagram.trim();
      if (cleanInstagram.includes('@')) {
        setInstagramError('Digite apenas o usuário do Instagram (sem e-mail, nem @).');
        setIsSubmitting(false);
        return;
      }
      setUserData({
        instagram: cleanInstagram,
        instagramRequestTime: Date.now()
      });

      // Call webhook in background immediately
      fetch('https://n8nsplus.up.railway.app/webhook/query_insta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instagram: cleanInstagram
        })
      }).then(response => response.json()).then(data => {
        console.log('Profile query response:', data);
        
        // Se retornar false ou erro, força total_found = 0
        if (data === false || data.error || !data) {
          console.log('Profile query returned error or false, setting total_found = 0');
          localStorage.setItem('profile-query-result', JSON.stringify({ total_found: 0 }));
        } else {
          // Store response for later use
          localStorage.setItem('profile-query-result', JSON.stringify(data));
        }
      }).catch(error => {
        console.error('Error querying profiles:', error);
        // Em caso de erro de rede, também marca como não encontrado
        localStorage.setItem('profile-query-result', JSON.stringify({ total_found: 0 }));
      });
      nextStep(); // Goes to Step2Modal
    }
  };
  return <div className="h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g fill="none" fillRule="evenodd">
            <g fill="#f5f5f5" fillOpacity="0.4">
              <circle cx="20" cy="20" r="1" />
            </g>
          </g>
        </svg>
      </div>
      
      <motion.div initial={{
      opacity: 0,
      y: 40,
      scale: 0.95
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} transition={{
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }} className="w-full max-w-lg relative z-10 max-h-[calc(100vh-2rem)]">
        <div className="bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
          {/* Hero Image Area */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            {/* Background Image */}
            <img src="/imgs/step1.webp" alt="Background" className="absolute inset-0 w-full h-full object-cover brightness-75" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-2xl shadow-lg flex items-center justify-center">
                <img src="/imgs/logo2.svg" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-8 sm:space-y-10">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }} className="text-center space-y-3">
              <h1 className="sm:text-xl font-bold text-foreground leading-tight text-xl">
                [Grátis] Teste sua Nova Secretária de I.A. em 1 Min.
              </h1>
              
              <p className="text-muted-foreground leading-relaxed mb-12">Treinaremos ela com base no seu Instagram automágicamente ✨</p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3,
            duration: 0.6
          }} className="space-y-4 mt-0">
              <div className="text-center">
                <p className="text-muted-foreground mb-3 font-normal text-sm mx-0 my-0 py-0">Insira seu @ profissional abaixo:</p>
              </div>

              <CustomInput prefix="@" placeholder="drabelguerra" value={instagram} onChange={e => {
                setInstagramError(null);
                setInstagram(e.target.value.toLowerCase());
              }} className="text-center" style={{
              textTransform: 'lowercase'
            }} autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode="text" name="instagram_handle" error={instagramError || undefined} />

              <CustomButton onClick={handleSubmit} disabled={!instagram.trim() || isSubmitting} size="md" className="w-full text-white bg-black hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-md text-center mx-0 py-[13px]">
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Iniciando teste...
                  </div>
                ) : (
                  'Testar Minha I.A Agora 🚀'
                )}
              </CustomButton>
            </motion.div>



            {/* Live counter */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.6,
            duration: 0.4
          }} className="text-center">
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
    </div>;
};