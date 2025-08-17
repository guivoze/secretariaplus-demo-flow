import { useEffect, useState } from "react";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
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

  // Check for Instagram data on mount
  useEffect(() => {
    console.log('Step6Loading: Checking for Instagram data...');
    const instagramData = localStorage.getItem('instagram-data');
    console.log('Instagram data from localStorage:', instagramData);
    
    if (instagramData) {
      try {
        const data = JSON.parse(instagramData);
        console.log('Parsed Instagram data:', data);
        
        // Update user data safely
        setUserData({
          hasInstagramData: true,
          realProfilePic: data.foto_perfil || null,
          realPosts: [data.post1, data.post2, data.post3].filter(Boolean) || [],
          aiInsights: {
            name: data.name || '',
            where: data.where || '',
            procedure1: data.procedure1 || '',
            procedure2: data.procedure2 || '',
            procedure3: data.procedure3 || '',
            rapport: data.rapport || ''
          }
        });
        
        // Update posts for slideshow
        const realPosts = [data.post1, data.post2, data.post3].filter(Boolean);
        if (realPosts.length > 0) {
          const postsWithMeta = realPosts.map((url: string) => ({
            image: url,
            likes: Math.floor(Math.random() * 200 + 50).toString(),
            comments: Math.floor(Math.random() * 30 + 5).toString()
          }));
          setPosts(postsWithMeta);
          console.log('Updated posts:', postsWithMeta);
        }
        
        // Set profile image
        if (data.foto_perfil) {
          setProfileImage(data.foto_perfil);
          console.log('Set profile image:', data.foto_perfil);
        }
      } catch (error) {
        console.error('Error parsing Instagram data:', error);
      }
    } else {
      console.log('No Instagram data found, using mock data');
    }
  }, [setUserData]);

  useEffect(() => {
    if (currentStepIndex < loadingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        nextStep();
      }, 1000);
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