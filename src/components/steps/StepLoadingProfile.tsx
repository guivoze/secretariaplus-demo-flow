import { useEffect } from "react";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";

export const StepLoadingProfile = () => {
  const { nextStep, userData } = useSupabaseDemo();

  useEffect(() => {
    // Verifica se o perfil já foi confirmado e tem dados
    const checkProfileData = () => {
      const instagramData = localStorage.getItem('instagram-data');
      
      if (instagramData) {
        try {
          const data = JSON.parse(instagramData);
          // Se tem dados do Instagram (true ou false), pode prosseguir
          if (data.hasInstagramData !== undefined || data.aiInsights) {
            console.log('Profile data found (true or false), proceeding immediately');
            nextStep();
            return;
          }
        } catch (error) {
          console.log('Error parsing Instagram data:', error);
        }
      }
      
      // Se chegou aqui e o perfil foi confirmado, mas ainda não tem dados, continua aguardando
      if (userData.instagramConfirmed) {
        console.log('Profile confirmed but no data yet, waiting...');
      } else {
        // Se o perfil não foi confirmado, algo deu errado, avança mesmo assim
        console.log('Profile not confirmed, proceeding anyway');
        setTimeout(() => nextStep(), 3000);
      }
    };

    // Verifica imediatamente
    checkProfileData();

    // Verifica a cada 1 segundo
    const interval = setInterval(checkProfileData, 1000);

    // Timeout de segurança - após 15 segundos, avança mesmo sem dados
    const timeout = setTimeout(() => {
      console.log('15s timeout reached, proceeding with fallbacks');
      nextStep();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [nextStep, userData.instagramConfirmed]);

  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="flex items-center justify-center">
        <img 
          src="/imgs/loadai.webp" 
          alt="Loading..." 
          className="opacity-80"
          style={{ width: '20%', height: 'auto', maxWidth: '200px', minWidth: '80px' }}
        />
      </div>
    </div>
  );
};
