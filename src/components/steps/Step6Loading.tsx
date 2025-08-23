import { useEffect, useState } from "react";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const getLoadingSteps = (rapport1: string, rapport2: string) => [
  "Treinando IA baseado no seu perfil...",
  rapport1 || "Analisando seus conteúdos...",
  rapport2 || "Criando conexão personalizada...",
  "Finalizando personalização..."
];

const instagramPosts = [
  {
    image: "/imgs/loadai.webp",
    likes: "142",
    comments: "23"
  },
  {
    image: "/imgs/loadai.webp", 
    likes: "89",
    comments: "12"
  },
  {
    image: "/imgs/loadai.webp",
    likes: "201",
    comments: "34"
  }
];

export const Step6Loading = () => {
  const { nextStep, userData, setUserData } = useSupabaseDemo();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [posts, setPosts] = useState(instagramPosts);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagesToPreload, setImagesToPreload] = useState<string[]>([]);
  
  // Images should already be preloaded, so set to true immediately
  const { allImagesLoaded } = useImagePreloader([]);
  
  // Get loading steps with rapport phrases
  const loadingSteps = getLoadingSteps(
    userData.aiInsights?.rapport1 || "", 
    userData.aiInsights?.rapport2 || ""
  );
  
  console.log('Step6Loading: allImagesLoaded:', allImagesLoaded, 'currentStepIndex:', currentStepIndex, 'imagesToPreload:', imagesToPreload);

  // Check for Instagram data on mount and set up posts
  useEffect(() => {
    const instagramData = localStorage.getItem('instagram-data');
    if (instagramData) {
      try {
        const data = JSON.parse(instagramData);
        setUserData(data);
        
        // Update posts for slideshow
        if (Array.isArray(data.realPosts)) {
          const validPostUrls: string[] = data.realPosts
            .filter((url: any) => typeof url === 'string' && url.trim().length > 0);

          if (validPostUrls.length > 0) {
            const realPosts = validPostUrls.map((url: string) => ({
              image: url,
              likes: Math.floor(Math.random() * 200 + 50).toString(),
              comments: Math.floor(Math.random() * 30 + 5).toString()
            }));
            setPosts(realPosts);
          } else {
            setPosts(instagramPosts);
          }
        } else {
          setPosts(instagramPosts);
        }
        
        // Set profile image
        if (typeof data.realProfilePic === 'string' && data.realProfilePic.trim().length > 0) {
          setProfileImage(data.realProfilePic);
        } else if (typeof data.profilePic === 'string' && data.profilePic.trim().length > 0) {
          setProfileImage(data.profilePic);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        console.log('Error parsing Instagram data:', error);
      }
    }
  }, []);

  // Progress through loading steps with custom timing
  useEffect(() => {
    if (currentStepIndex < loadingSteps.length) {
      // Custom timing: primeira (2s), rapport1 (4s), rapport2 (3s), última (1.5s)
      let duration = 2000;
      if (currentStepIndex === 1) duration = 4000; // rapport1
      else if (currentStepIndex === 2) duration = 3000; // rapport2
      else if (currentStepIndex === 3) duration = 1500; // última
      
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // All steps completed, proceed to next step
      const timer = setTimeout(() => {
        nextStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, nextStep]);

  // Background images change asynchronously
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPostIndex(prev => (prev + 1) % posts.length);
    }, 3500); // Diferente do timing das frases

    return () => clearInterval(timer);
  }, [posts]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated particles background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Instagram posts slideshow background with enhanced effects */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          key={currentPostIndex}
          initial={{ opacity: 0, scale: 1.2, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${posts[currentPostIndex].image})`,
            filter: 'blur(8px) brightness(0.7) contrast(1.2)'
          }}
        />
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-300/40 rounded-full"
      />
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/20 rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center space-y-8 shadow-2xl"
          animate={{ boxShadow: [
            "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            "0 25px 50px -12px rgba(168, 85, 247, 0.25)",
            "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          ]}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Enhanced profile section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "backOut" }}
            className="relative"
          >
            <motion.div
              className="w-20 h-20 mx-auto relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glowing ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 p-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {userData.instagram ? userData.instagram.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Sparkle effects around profile */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 text-yellow-300"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-1 -left-1 text-purple-300"
            >
              ⭐
            </motion.div>
          </motion.div>

          {/* Enhanced name section */}
          {userData.aiInsights?.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.span 
                className="text-lg font-semibold text-white"
                animate={{ textShadow: [
                  "0 0 10px rgba(168, 85, 247, 0.5)",
                  "0 0 20px rgba(168, 85, 247, 0.8)",
                  "0 0 10px rgba(168, 85, 247, 0.5)"
                ]}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {userData.aiInsights.name}
              </motion.span>
              <motion.i 
                className="fa-solid fa-sparkles text-yellow-300"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}

          {/* Enhanced loading text */}
          <div className="h-8 flex items-center justify-center">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="text-base font-medium text-white/90"
            >
              {currentStepIndex < loadingSteps.length ? loadingSteps[currentStepIndex] : "Concluído!"}
            </motion.div>
          </div>

          {/* Enhanced progress bar */}
          <div className="space-y-3">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / loadingSteps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            {/* Progress percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs text-white/70 font-medium"
            >
              {Math.round((currentStepIndex / loadingSteps.length) * 100)}% completo
            </motion.div>
          </div>

          {/* Loading dots animation */}
          <motion.div
            className="flex justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};