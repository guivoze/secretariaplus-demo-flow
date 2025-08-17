import { useEffect, useState } from "react";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const loadingSteps = [
  "Buscando seu Instagram...",
  "Analisando seus posts...",
  "Identificando seu público...",
  "Configurando sua I.A...",
  "Ajustando sua especialidade...",
  "Finalizando configurações..."
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
  const { nextStep, userData, setUserData } = useDemo();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [posts, setPosts] = useState(instagramPosts);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagesToPreload, setImagesToPreload] = useState<string[]>([]);
  
  // Images should already be preloaded, so set to true immediately
  const { allImagesLoaded } = useImagePreloader([]);
  
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

  // Progress through loading steps, images are already preloaded
  useEffect(() => {
    if (currentStepIndex < loadingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      // All steps completed, proceed to next step
      const timer = setTimeout(() => {
        nextStep();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, nextStep]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPostIndex(prev => (prev + 1) % posts.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [posts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Instagram posts slideshow background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          key={currentPostIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${posts[currentPostIndex].image})`,
            filter: 'blur(10px)'
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