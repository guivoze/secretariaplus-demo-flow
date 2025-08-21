import { Link } from "react-router-dom";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";

const Index = () => {
  const { setCurrentStep, setUserData } = useSupabaseDemo();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">SecretáriaPlus Demo</h1>
        <div className="space-x-3">
          <Link to="/" className="text-primary underline">Voltar</Link>
          <button
            className="px-4 py-2 rounded-lg bg-black text-white"
            onClick={() => {
              setUserData({ instagram: "teste_cli", especialidade: "Botox" });
              setCurrentStep(10);
            }}
          >
            Ir direto ao Chat (teste)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
