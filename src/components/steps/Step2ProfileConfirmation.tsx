import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion } from "framer-motion";

interface ProfileOption {
  at: string;
  username: string;
  photo: string;
}

export const Step2ProfileConfirmation = () => {
  const { userData, setUserData, nextStep, resetDemo, sessionId, findPreviousSession, openResumeModal } = useSupabaseDemo();
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [totalFound, setTotalFound] = useState<number>(0);

  useEffect(() => {
    // Get cached profile query result
    const cachedResult = localStorage.getItem('profile-query-result');
    if (cachedResult) {
      try {
        const data = JSON.parse(cachedResult);
        console.log('Using cached profile data:', data);
        
        // Check total_found and skip if 0
        const foundCount = data.total_found || 0;
        setTotalFound(foundCount);
        
        if (foundCount === 0) {
          console.log('No profiles found, skipping to next step');
          nextStep();
          return;
        }
        
        // Parse profile options if found > 0
        const profileOptions: ProfileOption[] = [];
        if (data && typeof data === 'object') {
          for (let i = 1; i <= 3; i++) {
            const userKey = `user${i}`;
            const nameKey = `name${i}`;
            const pfpKey = `pfp${i}`;
            
            if (data[userKey]) {
              const profile = {
                at: `@${data[userKey]}`,
                username: data[nameKey] || data[userKey],
                photo: data[pfpKey] || 'https://via.placeholder.com/150x150/E5C197/000000?text=Profile'
              };
              profileOptions.push(profile);
            }
          }
        }
        
        console.log('Final profiles array:', profileOptions);
        setProfiles(profileOptions);
        setTotalFound(profileOptions.length);
      } catch (error) {
        console.error('Error parsing cached data:', error);
        // Fallback
        setProfiles([{
          at: `@${userData.instagram}`,
          username: userData.instagram,
          photo: 'https://via.placeholder.com/150x150/E5C197/000000?text=Profile'
        }]);
      }
    } else {
      // No cached data, fallback
      setProfiles([{
        at: `@${userData.instagram}`,
        username: userData.instagram,
        photo: 'https://via.placeholder.com/150x150/E5C197/000000?text=Profile'
      }]);
    }
  }, [userData.instagram, nextStep]);

  const handleProfileSelect = (profileAt: string) => {
    setSelectedProfile(profileAt);
  };

  const handleConfirm = () => {
    if (!selectedProfile) return;

    const confirmedUsername = selectedProfile.replace('@', '');
    
    // Update user data with confirmed profile
    setUserData({ instagram: confirmedUsername });

    // This is the ONLY place where get_insta webhook should be called
    // Start Instagram scraping in background after profile confirmation
    console.log('Starting Instagram scrape for confirmed profile:', confirmedUsername);
    
    fetch('https://n8nsplus.up.railway.app/webhook/get_insta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instagram: confirmedUsername, session_id: sessionId })
    }).then(response => response.json())
      .then(data => {
        console.log('Instagram scrape completed:', data);
        if (data.perfil) {
          // Save real Instagram data to localStorage for loading step
          const candidatePosts = [data.post1, data.post2, data.post3]
            .filter((p: any) => typeof p === 'string' && p.trim().length > 0);

          const instagramData = {
            hasInstagramData: true,
            realProfilePic: typeof data.foto_perfil === 'string' && data.foto_perfil.trim().length > 0 ? data.foto_perfil : null,
            realPosts: candidatePosts,
            aiInsights: {
              name: data.name,
              where: data.where,
              procedure1: data.procedure1,
              procedure2: data.procedure2,
              procedure3: data.procedure3,
              rapport1: data.rapport1,
              rapport2: data.rapport2
            }
          };
          localStorage.setItem('instagram-data', JSON.stringify(instagramData));
          console.log('Instagram data cached for loading step:', instagramData);
        }
      })
      .catch(error => console.error('Error during Instagram scrape:', error));

    // Checa sessão anterior só após confirmação do perfil
    (async () => {
      const hasPrevious = await findPreviousSession(confirmedUsername);
      if (hasPrevious) {
        openResumeModal();
      }
      nextStep();
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <CustomCard variant="elevated" className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Confirma pra gente!
            </h2>
            <p className="text-muted-foreground text-sm">
              Você escreveu: @{userData.instagram} e encontramos...
            </p>
          </div>

          <div className="space-y-3">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.at}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => handleProfileSelect(profile.at)}
                className={`
                  flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedProfile === profile.at 
                    ? 'border-gray-800 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <img
                  src={profile.photo}
                  alt={profile.username}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground text-sm">
                    {profile.at}
                  </p>
                  <p className="text-muted-foreground text-xs break-words">
                    {profile.username}
                  </p>
                </div>
                {selectedProfile === profile.at && (
                  <div className="w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <CustomButton
              onClick={handleConfirm}
              disabled={!selectedProfile}
              className="w-full"
              size="lg"
            >
              CONFIRMAR PERFIL
            </CustomButton>

            <CustomButton
              onClick={() => {
                // Apenas fecha o modal/segue o fluxo sem resetar para step 0
                nextStep();
              }}
              variant="outline"
              className="w-full bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
              size="lg"
            >
              Vish, não é nenhum desses! Digitei errado.
            </CustomButton>
          </div>
        </CustomCard>
      </motion.div>
    </div>
  );
};