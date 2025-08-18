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
    image: "https://via.placeholder.com/300x300/E5C197/000000?text=Post+1",
    likes: "142",
    comments: "23"
  },
  {
    image: "https://via.placeholder.com/300x300/E5C197/000000?text=Post+2", 
    likes: "89",
    comments: "12"
  },
  {
    image: "https://via.placeholder.com/300x300/E5C197/000000?text=Post+3",
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
        if (data.realPosts && data.realPosts.length > 0) {
          const realPosts = data.realPosts.map((url: string, index: number) => ({
            image: url,
            likes: Math.floor(Math.random() * 200 + 50).toString(),
            comments: Math.floor(Math.random() * 30 + 5).toString()
          }));
          setPosts(realPosts);
        }
        
        // Set profile image
        if (data.realProfilePic) {
          setProfileImage(data.realProfilePic);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Instagram posts slideshow background */}
      <div className="absolute inset-0 opacity-32">
        <motion.div
          key={currentPostIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${posts[currentPostIndex].image})`,
            filter: 'blur(3px)'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <CustomCard variant="elevated" className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center overflow-hidden"
          >
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium text-white">
                {userData.instagram ? userData.instagram.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </motion.div>

          {/* Nome da pessoa com sparkles */}
          {userData.aiInsights?.name && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-center gap-1"
            >
              <span className="text-sm text-gray-500">
                {userData.aiInsights.name}
              </span>
              <i className="fa-solid fa-sparkles text-sm text-gray-500"></i>
            </motion.div>
          )}

          <div className="h-6 flex items-center justify-center">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-foreground font-medium"
            >
              {currentStepIndex < loadingSteps.length ? loadingSteps[currentStepIndex] : "Concluído!"}
            </motion.div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gray-800 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / loadingSteps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </CustomCard>
      </motion.div>
    </div>
  );
};