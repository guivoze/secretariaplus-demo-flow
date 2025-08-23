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
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Instagram posts slideshow background with enhanced blur */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          key={currentPostIndex}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${posts[currentPostIndex].image})`,
            filter: 'blur(8px) saturate(1.2)'
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-background/90 backdrop-blur-xl rounded-3xl p-8 text-center space-y-8 shadow-2xl border border-white/10">
          {/* Enhanced profile image with glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto"
          >
            <div className="w-24 h-24 relative">
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ padding: '3px' }}
              >
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-foreground">
                      {userData.instagram ? userData.instagram.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced name with magical sparkles */}
          {userData.aiInsights?.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.i 
                className="fa-solid fa-sparkles text-accent"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="text-lg font-medium text-foreground">
                {userData.aiInsights.name}
              </span>
              <motion.i 
                className="fa-solid fa-sparkles text-accent"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>
          )}

          {/* Enhanced loading text with typewriter effect */}
          <div className="h-8 flex items-center justify-center">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-lg font-medium text-foreground relative"
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 0px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 0px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentStepIndex < loadingSteps.length ? loadingSteps[currentStepIndex] : "Concluído!"}
              </motion.span>
            </motion.div>
          </div>

          {/* Enhanced progress bar with glow */}
          <div className="space-y-3">
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / loadingSteps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ 
                    x: ["-100%", "100%"] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
            
            {/* Progress percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground font-medium"
            >
              {Math.round((currentStepIndex / loadingSteps.length) * 100)}%
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};