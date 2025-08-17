import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserData {
  instagram: string;
  nome: string;
  email: string;
  whatsapp: string;
  especialidade: string;
  faturamento: string;
  // Mock data
  followers: string;
  posts: string;
  profilePic: string | null;
  clinicName: string;
  procedures: string[];
}

interface DemoContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  resetDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialUserData: UserData = {
  instagram: '',
  nome: '',
  email: '',
  whatsapp: '',
  especialidade: '',
  faturamento: '',
  followers: '1.2K',
  posts: '324',
  profilePic: null,
  clinicName: 'Clínica Exemplo',
  procedures: ['Botox', 'Preenchimento', 'Limpeza de Pele']
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserDataState] = useState<UserData>(initialUserData);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem('demo-step');
    const savedData = localStorage.getItem('demo-data');
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedData) {
      setUserDataState(JSON.parse(savedData));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('demo-step', currentStep.toString());
    localStorage.setItem('demo-data', JSON.stringify(userData));
  }, [currentStep, userData]);

  const setUserData = (data: Partial<UserData>) => {
    setUserDataState(prev => ({ ...prev, ...data }));
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setUserDataState(initialUserData);
    localStorage.removeItem('demo-step');
    localStorage.removeItem('demo-data');
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 15)); // Max 16 steps (0-15)
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <DemoContext.Provider value={{
      currentStep,
      setCurrentStep,
      userData,
      setUserData,
      resetDemo,
      nextStep,
      prevStep
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};