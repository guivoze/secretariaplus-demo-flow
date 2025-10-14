import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { useClarity } from "@/hooks/useClarity";
import { FlowType } from "@/hooks/useFlowType";
import { Step16CTALegacy } from "./Step16CTALegacy";
import { motion } from "framer-motion";
import { ArrowRight, Settings, Users, Zap, Shield, Calendar, MessageSquare, Clock } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

interface Step16CTAProps {
  flowType: FlowType;
}

export const Step16CTA = ({ flowType }: Step16CTAProps) => {
  // Se for flow legacy (/lead), renderiza o componente de consultor
  if (flowType === 'lead') {
    return <Step16CTALegacy />;
  }

  // Flow padrão - renderiza os planos
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { userData } = useSupabaseDemo();
  const clarity = useClarity({ 
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID || "t5ehdfteyd" 
  });

  // Mostrar planos (e heading com nome) somente após 2:58
  const [showPlans, setShowPlans] = useState(false);
  useEffect(() => {
    const delayMs = 2 * 60 * 1000 + 58 * 1000; // 2:58
    const t = setTimeout(() => setShowPlans(true), delayMs);
    return () => clearTimeout(t);
  }, []);
  // Permite destravar via query (?unlock=1) para QA
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('unlock') === '1') setShowPlans(true);
    } catch {}
  }, []);

  // Toggle iOS (anual por padrão)
  const [isAnnual, setIsAnnual] = useState(true);

  // Estados dos bônus com timers específicos
  const [showBonus1, setShowBonus1] = useState(false);
  const [showBonus2, setShowBonus2] = useState(false);
  const [showBonus3, setShowBonus3] = useState(false);
  const [showGuarantee, setShowGuarantee] = useState(false);

  // Timers para bônus e garantia
  useEffect(() => {
    const bonus1Timer = setTimeout(() => setShowBonus1(true), 3 * 60 * 1000 + 25 * 1000); // 3:25
    const bonus2Timer = setTimeout(() => setShowBonus2(true), 4 * 60 * 1000); // 4:00
    const bonus3Timer = setTimeout(() => setShowBonus3(true), 4 * 60 * 1000 + 33 * 1000); // 4:33
    const guaranteeTimer = setTimeout(() => setShowGuarantee(true), 5 * 60 * 1000 + 30 * 1000); // 5:30

    return () => {
      clearTimeout(bonus1Timer);
      clearTimeout(bonus2Timer);
      clearTimeout(bonus3Timer);
      clearTimeout(guaranteeTimer);
    };
  }, []);

  // Unlock para QA - destravar todos os timers
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('unlock') === '1') {
        setShowBonus1(true);
        setShowBonus2(true);
        setShowBonus3(true);
        setShowGuarantee(true);
      }
    } catch {}
  }, []);

  // Botão do WhatsApp (3 min e 10s)
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowWhatsApp(true), 3 * 60 * 1000 + 10 * 1000); // 3:10
    return () => clearTimeout(timer);
  }, []);

  // VTurb player (Web Component) com fallback para iframe
  const vturbScriptSrc = useMemo(() =>
    "https://scripts.converteai.net/8ddd9233-b1be-436f-9067-8ebf120271e1/players/68d1c3470bbc693b0cadac02/v4/player.js",
  []);
  const [useWebComponent, setUseWebComponent] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Evita injetar script duplicado
    const alreadyLoaded = Array.from(document.scripts).some(s => s.src.includes("68d1c3470bbc693b0cadac02/v4/player.js"));
    let fallbackTimer: number | undefined;

    if (!alreadyLoaded) {
      const s = document.createElement('script');
      s.src = vturbScriptSrc;
      s.async = true;
      s.onload = () => {
        // Se o custom element estiver definido, seguimos com web component
        if ((window as any).customElements && (window as any).customElements.get && (window as any).customElements.get('vturb-smartplayer')) {
          setUseWebComponent(true);
        }
      };
      s.onerror = () => {
        setUseWebComponent(false);
        // Carrega SDK auxiliar (iframe embed)
        const sdk = document.createElement('script');
        sdk.src = 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js';
        sdk.async = true;
        document.head.appendChild(sdk);
      };
      document.head.appendChild(s);
    }

    // Fallback se o custom element não registrar em tempo hábil
    fallbackTimer = window.setTimeout(() => {
      const defined = (window as any).customElements?.get?.('vturb-smartplayer');
      if (!defined) {
        setUseWebComponent(false);
        const sdk = document.createElement('script');
        sdk.src = 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js';
        sdk.async = true;
        document.head.appendChild(sdk);
      }
    }, 3000);

    return () => {
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [vturbScriptSrc]);

  // Define src do iframe quando em fallback
  useEffect(() => {
    if (!useWebComponent && iframeRef.current && !iframeRef.current.src) {
      const base = 'https://scripts.converteai.net/8ddd9233-b1be-436f-9067-8ebf120271e1/players/68d1c3470bbc693b0cadac02/v4/embed.html';
      const q = window.location.search || '?';
      const vl = encodeURIComponent(window.location.href);
      iframeRef.current.src = `${base}${q}&vl=${vl}`;
    }
  }, [useWebComponent]);

  const planConfig = {
    monthly: {
      basic: { price: "R$ 497/mês", url: "https://pay.hub.la/W8HlbFk4vd9GRGqNkGuM" },
      pro: { price: "R$ 997/mês", url: "https://pay.hub.la/zFTMlne4LYBxoZyHXPXO" },
    },
    annual: {
      basic: { price: "12x de R$ 397", url: "https://pay.hub.la/xezMgMYfLckK9OOCQXy4" },
      pro: { price: "12x de R$ 797", url: "https://pay.hub.la/kaZ1HpFAoTBdYDUhbmVb" },
    },
  } as const;
  const currentPlans = isAnnual ? planConfig.annual : planConfig.monthly;

  const handlePlanClick = (planUrl: string, planName: string) => {
    // Tracking avançado no Clarity para conversões
    clarity.trackConversion(planName, userData);
    
    // Tracking adicional da interação
    clarity.trackInteraction('plan_click', {
      plan_name: planName,
      plan_type: isAnnual ? 'annual' : 'monthly',
      user_specialty: userData.especialidade || 'unknown',
      has_instagram_data: userData.hasInstagramData ? 'true' : 'false',
    });
    
    console.log(`Plan selected: ${planName} (${isAnnual ? 'annual' : 'monthly'})`);
    window.open(planUrl, '_blank');
  };

  const handleWhatsAppClick = () => {
    // Tracking do clique no WhatsApp
    clarity.trackInteraction('whatsapp_click', {
      user_specialty: userData.especialidade || 'unknown',
      plan_type: isAnnual ? 'annual' : 'monthly',
      has_instagram_data: userData.hasInstagramData ? 'true' : 'false',
    });
    
    window.open('https://api.whatsapp.com/send?phone=5511936191391&text=Oi%20Thamara.%20Acabei%20de%20fazer%20meu%20teste%20gratuito%20e%20tenho%20uma%20d%C3%BAvida%20sobre%20o%20Secret%C3%A1riaPlus.', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 py-8">
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Logo no topo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center justify-center mb-[0%]"
          >
            <img src="/imgs/logo-blk.svg" alt="Logo SecretariaPlus" className="w-20 h-20" />
          </motion.div>

          {/* Título e subtítulo (vídeo) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-2 mb-[10%]"
          >
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">E quanto custa tudo isso?</h1>
            <p className="text-base text-gray-600">assista o vídeo e descubra</p>
          </motion.div>

          {/* Player VTurb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <div className="w-full" style={{ maxWidth: 400, margin: '0 auto' }}>
              {useWebComponent ? (
                <vturb-smartplayer id="vid-68d1c3470bbc693b0cadac02" style={{ display: 'block', width: '100%' }}></vturb-smartplayer>
              ) : (
                <div id="ifr_68d1c3470bbc693b0cadac02_wrapper" style={{ margin: '0 auto', width: '100%', maxWidth: 400 }}>
                  <div id="ifr_68d1c3470bbc693b0cadac02_aspect" style={{ position: 'relative', padding: '125% 0 0 0' }}>
                    <iframe
                      ref={iframeRef}
                      id="ifr_68d1c3470bbc693b0cadac02"
                      frameBorder={0}
                      allowFullScreen
                      referrerPolicy="origin"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Heading com nome + switcher e planos (após delay) */}
          {showPlans && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-center space-y-2 mt-[15%] mb-8"
                id="plans-section"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {(userData?.nome?.split(' ')[0] || '').trim() ? `${userData.nome.split(' ')[0]}, ` : ''}
                  escolha o plano
                </h2>
                <p className="text-base text-gray-600 mt-0">que mais combina com você</p>
              </motion.div>

              {/* Toggle iOS centralizado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="relative w-full h-12 mb-10 "
              >
                {/* Toggle sozinho, absolutamente centralizado */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setIsAnnual(!isAnnual)}
                    role="switch"
                    aria-checked={isAnnual}
                    className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                      isAnnual ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        isAnnual ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Texto "mensal" à esquerda do toggle */}
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-full -ml-12">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}
                  >
                    mensal
                  </button>
                </div>

                {/* Texto "anual" à direita do toggle */}
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 ml-12">
                  <div className="flex flex-col items-start">
                    <button
                      onClick={() => setIsAnnual(true)}
                      className={`text-sm font-medium transition-colors ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                      anual
                    </button>
                    <span className="text-xs text-gray-400">2 meses grátis 🔥</span>
                  </div>
                </div>
              </motion.div>

              {/* Plano Basic */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-6">
                <CustomCard variant="elevated" className="p-6 space-y-4 border-2 border-gray-200 bg-white">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 capitalize">Plano Basic</h3>

                    <div className="space-y-3 text-left text-gray-700 mb-10 text-sm">
                      <div className="flex items-start gap-3">
                        <Settings className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Configure procedimentos, seus horários, jeito de falar da IA e muito mais</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Notificações (emergência, agendamentos)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Atenda seus pacientes 24/7</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Follow up automático</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Agenda automática</span>
                      </div>
                    </div>

                    <div className="text-3xl font-bold text-gray-900 mb-6">
                      {isAnnual ? (
                        <><span className="text-lg font-medium text-gray-600">12x de </span>R$ 397</>
                      ) : (
                        <>R$ 497<span className="text-lg text-gray-600">/mês</span></>
                      )}
                    </div>

                    <button
                      onClick={() => handlePlanClick(currentPlans.basic.url, 'Basic')}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Iniciar Agora
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </CustomCard>
              </motion.div>

              {/* Plano Pro */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <CustomCard variant="elevated" className="p-6 space-y-4 border-2 border-gray-600 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                  {/* Badge Popular */}
                  <div className="absolute -top-1 -right-1">
                    <div className="bg-gray-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">Plano Pro</h3>

                    <div className="space-y-3 text-left text-gray-700 mb-6 text-sm">
                      <div className="flex items-start gap-3">
                        <span className="text-gray-600 font-medium text-sm mt-0.5 flex-shrink-0">+</span>
                        <span className="font-medium">Tudo do Basic</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>CRM automático</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Suporte dedicado</span>
                      </div>
                    </div>

                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {isAnnual ? (
                        <><span className="text-lg font-medium text-gray-600">12x de </span>R$ 797</>
                      ) : (
                        <>R$ 997<span className="text-lg text-gray-600">/mês</span></>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-regular mb-6">🤍 Mais escolhido pelos profissionais</p>

                    <button
                      onClick={() => handlePlanClick(currentPlans.pro.url, 'Pro')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Iniciar Agora
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </CustomCard>
              </motion.div>

              {/* Espaço de respiro entre planos e bônus */}
              <div className="mb-[20%]"></div>

              {/* Bônus travados (mesmo timer dos planos) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 mb-8"
              >
                <div className="text-center mb-7 px-4">
                  <h4 className="text-2xl font-bold text-gray-900">
                    + de R$ 6 mil em bônus
                  </h4>
                  <p className="text-base text-gray-600 mt-1">te acompanham em qualquer plano 🚀</p>
                </div>
                <div className="space-y-6">
                  {/* Bônus 1 */}
                  <div>
                    <div className="rounded-3xl border border-gray-300 bg-white shadow-sm p-6 flex items-center gap-4">
                      {/* Imagem do bônus 1 - condicional */}
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {showBonus1 ? (
                          <img src="/imgs/bonus1.jpg" alt="Bônus 1" className="w-full h-full object-cover" />
                        ) : (
                          <img src="/imgs/lock.jpg" alt="Bônus Bloqueado" className="w-full h-full object-cover" />
                        )}
                      </div>
                      
                      {/* Conteúdo do bônus - condicional */}
                      <div className="flex-1">
                        {showBonus1 ? (
                          <>
                            <h5 className="text-xl font-bold text-gray-900 mb-2">Bônus 1: Conteúdo Infinito</h5>
                            <p className="text-base text-gray-700 leading-relaxed">
                              Gere seu clone de IA indistinguível a realidade e economize tempo com produção de conteúdo.
                            </p>
                          </>
                        ) : (
                          <>
                            <h5 className="text-xl font-bold text-gray-900 mb-2">Bônus 1: Assista o Vídeo</h5>
                            <p className="text-base text-gray-700 leading-relaxed">
                              Descubra este bônus incrível terminando de assistir o vídeo acima.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Preço discreto embaixo */}
                    <div className="text-center pt-3 pb-2">
                      <span className="text-base text-gray-500 line-through mr-2">R$ 1500</span>
                      <span className="text-base font-semibold text-green-600">Grátis</span>
                    </div>
                  </div>

                  {/* Bônus 2 */}
                  <div>
                    <div className="rounded-3xl border border-gray-300 bg-white shadow-sm p-6 flex items-center gap-4">
                      {/* Imagem do bônus 2 - condicional */}
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {showBonus2 ? (
                          <img src="/imgs/bonus2.jpg" alt="Bônus 2" className="w-full h-full object-cover" />
                        ) : (
                          <img src="/imgs/lock.jpg" alt="Bônus Bloqueado" className="w-full h-full object-cover" />
                        )}
                      </div>
                      
                      {/* Conteúdo do bônus - condicional */}
                      <div className="flex-1">
                        {showBonus2 ? (
                          <>
                            <h5 className="text-xl font-bold text-gray-900 mb-2">Bônus 2: Agente HLD</h5>
                            <p className="text-base text-gray-700 leading-relaxed">
                              Tirado da mentoria High Level Doctor, um agente de IA especialista em criação de conteúdo para instagram específico para profissionais da saúde sem tempo.
                            </p>
                          </>
                        ) : (
                          <>
                            <h5 className="text-xl font-bold text-gray-900 mb-2">Bônus 2: Assista o Vídeo</h5>
                            <p className="text-base text-gray-700 leading-relaxed">
                              Descubra este bônus incrível terminando de assistir o vídeo acima.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Preço discreto embaixo */}
                    <div className="text-center pt-3 pb-2">
                      <span className="text-base text-gray-500 line-through mr-2">R$ 1297</span>
                      <span className="text-base font-semibold text-green-600">Grátis</span>
                    </div>
                  </div>

                  {/* Bônus 3 */}
                  <div>
                    <div className="rounded-3xl border border-gray-300 bg-white shadow-sm p-6 flex items-center gap-4">
                      {/* Imagem do bônus 3 - condicional */}
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {showBonus3 ? (
                          <img src="/imgs/bonus3.jpg" alt="Bônus 3" className="w-full h-full object-cover" />
                        ) : (
                          <img src="/imgs/lock.jpg" alt="Bônus Bloqueado" className="w-full h-full object-cover" />
                        )}
                      </div>
                      
                      {/* Conteúdo do bônus - condicional */}
                      <div className="flex-1">
                        {showBonus3 ? (
                          <>
                            <h5 className="text-xl font-bold text-gray-900 mb-2">Bônus 3: Consultoria de Tráfego Express</h5>
                            <p className="text-base text-gray-700 leading-relaxed">
                              Uma call gratuita com um de nossos especialistas em funil de vendas para te ajudar a resolver problemas com anúncios e aquisição de pacientes.
                            </p>
                          </>
                        ) : (
                          <>
                            <h5 className="text-xl font-bold text-gray-900 mb-2">Bônus 3: Assista o Vídeo</h5>
                            <p className="text-base text-gray-700 leading-relaxed">
                              Descubra este bônus incrível terminando de assistir o vídeo acima.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Preço discreto embaixo */}
                    <div className="text-center pt-3 pb-2">
                      <span className="text-base text-gray-500 line-through mr-2">R$ 3.000</span>
                      <span className="text-base font-semibold text-green-600">Grátis</span>
                    </div>
                  </div>

                  {/* TODO: Lógica de "travado" comentada - implementar depois */}
                  {/*
                  {['1','2','3'].map((n) => (
                    <div
                      key={n}
                      className="rounded-3xl border border-gray-300 bg-white shadow-sm p-6 min-h-36 flex items-center justify-center"
                    >
                      <span className="text-center text-base text-gray-700 leading-relaxed max-w-[85%]">
                        🔒 assista o vídeo até o final para revelar o bônus {n}
                      </span>
                    </div>
                  ))}
                  */}
                </div>
              </motion.div>

              {/* Seção de Garantia 30 dias - condicional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-12 mb-12 text-center"
              >
                {/* Imagem da garantia - condicional */}
                <div className="flex justify-center mb-6">
                  {showGuarantee ? (
                    <img src="/imgs/30d.webp" alt="Garantia 30 dias" className="w-32 h-32 object-contain" />
                  ) : (
                    <img src="/imgs/pad.png" alt="Garantia Bloqueada" className="w-32 h-32 object-contain" />
                  )}
                </div>
                
                {/* Título e descrição da garantia - condicional */}
                {showGuarantee ? (
                  <>
                    {/* Título da garantia */}
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                      Sua IA não agendou<br />
                      UM PACIENTE em até 30 dias?
                    </h4>
                    
                    {/* Descrição da garantia */}
                    <p className="text-base text-gray-700 leading-relaxed max-w-md mx-auto mb-8">
                      Devolvemos todo seu $$$, e ainda fazemos R$ 500 no seu pix como gesto de perdão pelo seu tempo perdido.
                    </p>
                    
                    {/* Botão Iniciar Agora - idêntico aos dos planos */}
                    <button
                      onClick={() => {
                        const plansSection = document.getElementById('plans-section');
                        if (plansSection) {
                          plansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="w-full max-w-sm mx-auto bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Iniciar Agora
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Título locked */}
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                      Garantia
                    </h4>
                    
                    {/* Descrição locked */}
                    <p className="text-base text-gray-700 leading-relaxed max-w-md mx-auto">
                      Assista o vídeo e descubra sua garantia IRRECUSÁVEL.
                    </p>
                  </>
                )}
              </motion.div>
            </>
          )}

          {/* (Removido aviso do timer dos planos) */}
        </motion.div>
      </div>

      {/* Botão flutuante do WhatsApp */}
      {showWhatsApp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute -top-12 -left-20 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
          >
            Alguma dúvida?
            <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-800"></div>
          </motion.div>
          <button
            onClick={handleWhatsAppClick}
            className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <img src="/imgs/wpp.webp" alt="WhatsApp" style={{ width: '32px', height: '32px' }} className="object-contain" />
          </button>
        </motion.div>
      )}
    </div>
  );
};