import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomCard } from "@/components/ui/custom-card";
import { useDemo } from "@/hooks/useDemo";
import { motion } from "framer-motion";

interface ProfileOption {
  at: string;
  username: string;
  photo: string;
}

export const Step2ProfileConfirmation = () => {
  const { userData, setUserData, nextStep } = useDemo();
  const [profiles, setProfiles] = useState<ProfileOption[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Call the query webhook to get profile options
    const queryProfiles = async () => {
      try {
        const response = await fetch('https://n8nsplus.up.railway.app/webhook/query_insta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instagram: userData.instagram })
        });
        
        const data = await response.json();
        
        console.log('Webhook response:', data);
        
        // Parse the response format - it's an object, not an array
        const profileOptions: ProfileOption[] = [];
        if (data && typeof data === 'object') {
          console.log('Processing object:', data);
          
          // Add each user found
          for (let i = 1; i <= 3; i++) {
            const userKey = `user${i}`;
            const nameKey = `name${i}`;
            const pfpKey = `pfp${i}`;
            
            console.log(`Checking ${userKey}:`, data[userKey]);
            
            if (data[userKey]) {
              const profile = {
                at: `@${data[userKey]}`,
                username: data[nameKey] || data[userKey],
                photo: data[pfpKey] || 'https://via.placeholder.com/150x150/E5C197/000000?text=Profile'
              };
              console.log('Adding profile:', profile);
              profileOptions.push(profile);
            }
          }
        }
        
        console.log('Final profiles array:', profileOptions);
        
        setProfiles(profileOptions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        // Fallback to single profile with mock data
        setProfiles([{
          at: `@${userData.instagram}`,
          username: userData.instagram,
          photo: 'https://via.placeholder.com/150x150/E5C197/000000?text=Profile'
        }]);
        setIsLoading(false);
      }
    };

    queryProfiles();
  }, [userData.instagram]);

  const handleProfileSelect = (profileAt: string) => {
    setSelectedProfile(profileAt);
  };

  const handleConfirm = () => {
    if (!selectedProfile) return;

    // Update user data with confirmed profile
    setUserData({ instagram: selectedProfile.replace('@', '') });

    // Send confirmation to webhook in background (no await)
    fetch('https://n8nsplus.up.railway.app/webhook/get_insta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instagram: selectedProfile.replace('@', '') })
    }).then(response => response.json())
      .then(data => {
        if (data.perfil) {
          // Save real Instagram data to localStorage
          const instagramData = {
            hasInstagramData: true,
            realProfilePic: data.foto_perfil,
            realPosts: [data.post1, data.post2, data.post3],
            aiInsights: {
              name: data.name,
              where: data.where,
              procedure1: data.procedure1,
              procedure2: data.procedure2,
              procedure3: data.procedure3,
              rapport: data.rapport
            }
          };
          localStorage.setItem('instagram-data', JSON.stringify(instagramData));
        }
      })
      .catch(error => console.error('Error confirming profile:', error));

    // Go to next step immediately
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <CustomCard variant="elevated" className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-foreground">Buscando perfis...</p>
        </CustomCard>
      </div>
    );
  }

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
            <p className="text-muted-foreground">
              Qual destes é o seu perfil?
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
                  <p className="text-muted-foreground text-xs truncate">
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

          <CustomButton
            onClick={handleConfirm}
            disabled={!selectedProfile}
            className="w-full"
            size="lg"
          >
            CONFIRMAR PERFIL
          </CustomButton>
        </CustomCard>
      </motion.div>
    </div>
  );
};