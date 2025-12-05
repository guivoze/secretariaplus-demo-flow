import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useAnimationControls } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Sparkles, ArrowRight, ChevronRight, MessageSquare, Star, CircleDot, Mic, Calendar, Database, Repeat, Bell, MessageCircle, Rocket, Shield } from "lucide-react";

const mockOfferContent = {
  head: "Você não nasceu pra ser secretária",
  copy1: "Seu trabalho exige dedicação total. Mas quem cuida do WhatsApp enquanto você atende?",
  copy2: "Seu tempo é valioso",
  copy3: "Entre consultas, procedimentos e a vida pessoal — cada minuto conta.",
  head2: "Você merece mais tempo para o que importa",
  copy4: "Imagine voltar do consultório e encontrar tudo organizado. Sem áudios pendentes. Sem caos. Só resultados.",
};

// Carrossel lateral simples e elegante
const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Cards com conteúdo real do Step13/14
  const allCards = [
    {
      id: 'interface',
      title: 'Interface simples',
      description: 'Sem parafernalha tecnológica.',
      image: '/imgs/tela.webp',
      isImageCard: true
    },
    {
      id: 'crm',
      title: 'CRM Automático',
      description: 'Você terá um CRM que se alimenta e arrasta os cards sozinho pra você 😍',
      subtitle: '- pra quem não tem paciência de gerenciar ferramentas',
      image: '/imgs/crm.webp'
    },
    {
      id: 'audio',
      title: 'Escuta Áudio',
      description: 'Ela ouve áudios, responde quantos pacientes precisar, tem um leve delay para favorecer a ideia de humanização...',
      subtitle: '- Muitos dos nossos clientes usam, e as pessoas nem percebem que é uma IA 🤫',
      image: '/imgs/audio.webp'
    },
    {
      id: 'followup',
      title: 'FollowUp',
      description: 'Se o paciente te der um vácuo, a própria IA dá aquela cutucadinha pra ele voltar o papo e prosseguir',
      image: '/imgs/follow up.webp'
    },
    {
      id: 'notif',
      title: 'Notificações',
      description: 'Caso ocorram emergências, agendamentos e situações que exijam sua atenção, você recebe um aviso e cai direto na conversa.',
      image: '/imgs/step14.webp',
      imageFit: 'contain' // Ajuste exclusivo para esta imagem
    }
  ];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allCards.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
  };

  // Autoplay a cada 5s
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [currentIndex]); // Reinicia o timer quando muda de slide

  // Touch/swipe handling
  const startX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    
    if (Math.abs(diff) > 50) { // threshold de 50px
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Carrossel Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {allCards.map((card) => {
            const isImageCard = 'isImageCard' in card && card.isImageCard;
            
            return (
              <div key={card.id} className="min-w-full px-4">
                <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden mx-auto max-w-md" style={{ height: '380px' }}>
                  {isImageCard ? (
                    // Card especial de interface (full image)
                    <div className="relative h-full">
                      <img 
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-zinc-800 p-4">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                          {card.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Cards de features com imagem + texto
                    <div className="h-full flex flex-col">
                      {/* Imagem no topo */}
                      <div className="h-[180px] bg-gray-100 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
                        <img 
                          src={card.image}
                          alt={card.title}
                          className={`w-full h-full ${'imageFit' in card && card.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                        />
                      </div>
                      
                      {/* Conteúdo do card */}
                      <div className="flex-1 p-5 flex flex-col">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {card.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">
                          {card.description}
                        </p>
                        {'subtitle' in card && card.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
                            {card.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Navegador de dots */}
      <div className="flex items-center justify-center gap-2">
        {allCards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-2 bg-gray-900 dark:bg-white' 
                : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hint abaixo dos cards */}
      <p className="text-sm text-gray-500 text-center">
        Arraste pro lado
      </p>
    </div>
  );
};
const leftFeatureCard = {
  icon: Sparkles,
  title: "Secretária que conhece cada protocolo",
  description: "Treinada com seu Instagram e scripts, ela fala de MPT, Cross Peel e Rejuvenat como se tivesse aprendido com você.",
};

// Apenas a primeira seção no ar. Itens abaixo foram removidos neste sketch.


// Texto circular com rotação suave
const SpinningCircularText = ({
  text = "secretariaplus • atendimento 24h • agenda automática • follow‑up • ",
  size = 120,
  duration = 18,
  className = ""
}: {
  text?: string;
  size?: number;
  duration?: number;
  className?: string;
}) => {
  const radius = size / 2 - 8; // padding interno
  const id = "circlePathSketchOffer";
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration }}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id={id}
            d={`M ${size / 2} ${size / 2} m -${radius},0 a ${radius},${radius} 0 1,1 ${
              radius * 2
            },0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text
          fontSize={Math.max(10, Math.round(size * 0.11))}
          className="fill-black dark:fill-white drop-shadow-sm"
          style={{ letterSpacing: "0.5px", fontWeight: 400 }}
        >
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
    </motion.div>
  );
};

// Componente para a imagem com paralax
// Controls de posicionamento da imagem (fáceis de ajustar):
// - topAnchorPx: a que distância do topo da seção a LINHA DO TOPO DO CARD fica.
//   A imagem é alinhada de forma que seu CENTRO coincida com essa linha (50% fora / 50% dentro).
// - sizePx: tamanho da imagem (width/height em px).
// - parallaxPx: intensidade do efeito de scroll.
const ScrollParallaxImage = ({ topAnchorPx, sizePx, parallaxPx }: { topAnchorPx: number; sizePx: number; parallaxPx: number; }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });

  // Parallax sutil no scroll (ajuste parallaxPx para mais/menos efeito)
  const y = useTransform(scrollYProgress, [0, 1], [parallaxPx, -parallaxPx]);

  return (
    <motion.div
      ref={imageRef}
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
      style={{ y, top: topAnchorPx }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative" style={{ width: sizePx, height: sizePx }}>
        {/* Outer glow suave */}
        <div className="absolute inset-0 bg-white/10 blur-3xl scale-125 rounded-full" />
        <img
          src="/imgs/go1.png"
          alt="SecretáriaPlus GO"
          className="object-contain relative z-10 drop-shadow-2xl"
          style={{ width: sizePx, height: sizePx }}
        />
      </div>
    </motion.div>
  );
};

export const Step16SketchOffer = () => {
  const { userData, sessionId } = useSupabaseDemo();
  const [offerContent, setOfferContent] = useState(mockOfferContent);
  const [isLoadingCopy, setIsLoadingCopy] = useState(true);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [profileImages, setProfileImages] = useState({
    profilePic: userData.realProfilePic || null,
    post1: userData.realPosts?.[0] || null,
    post2: userData.realPosts?.[1] || null,
    post3: userData.realPosts?.[2] || null,
  });
  const [countdown, setCountdown] = useState("--:--");

  // Loading inicial de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Estilos CSS para bolds mais escuros (sutil)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .offer-content {
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
        display: block;
      }
      .offer-content strong {
        color: rgb(0 0 0 / 0.7) !important;
        font-weight: 500;
      }
      .dark .offer-content strong {
        color: rgb(255 255 255 / 0.85) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Buscar offer_copy do localStorage (já vem do webhook)
  useEffect(() => {
    const loadOfferCopy = () => {
      try {
        const cachedOfferCopy = localStorage.getItem('offer-copy');
        
        if (cachedOfferCopy) {
          const copy = JSON.parse(cachedOfferCopy);
          
          // Validate session_id to prevent using old cached copy
          if (copy.session_id && copy.session_id !== sessionId) {
            console.warn('[Offer] Cached copy is from different session, ignoring:', {
              cached: copy.session_id,
              current: sessionId
            });
            localStorage.removeItem('offer-copy');
            setIsLoadingCopy(false);
            return;
          }
          
          console.log('Offer copy loaded from cache:', copy);
          
          setOfferContent({
            head: copy.head_father || mockOfferContent.head,      // HEAD principal
            copy1: copy.copy_father || mockOfferContent.copy1,    // COPY principal
            copy2: copy.head1 || mockOfferContent.copy2,          // HEAD secundário 1
            copy3: copy.copy1 || mockOfferContent.copy3,          // COPY secundário 1
            head2: copy.head2 || 'Seus posts estão conquistando atenção',  // HEAD secundário 2
            copy4: copy.copy2 || mockOfferContent.copy3,          // COPY secundário 2
          });
          setIsLoadingCopy(false);
        } else {
          // Se não tiver cache, usa mock
          console.log('No cached offer copy found, using mock');
          setIsLoadingCopy(false);
        }
      } catch (err) {
        console.error('Error loading offer copy from localStorage:', err);
        setIsLoadingCopy(false);
      }
    };

    // Carregar imediatamente
    loadOfferCopy();
  }, [sessionId]);

  // Controladores para posicionar o selo giratório entre os cards dos planos
  const circularBadgeConfig = {
    size: 110,
    logoSize: 26,
    // Posição relativa ao container dos cards (ajuste esses valores livremente)
    topOffset: "50%", // ex: "50%" = meio dos cards, "30%" = mais pro topo
    leftOffset: "50%", // ex: "50%" = centro horizontal
    translateX: "-50%", // ajuste fino horizontal em %
    translateY: "-50%", // ajuste fino vertical em %
  };

  const name = userData.nome?.split(" ")[0] || "";

  const loteData = [
    { label: 'Lote 1', statusLabel: 'esgotado', state: 'inactive' as const },
    { label: 'Lote 2', statusLabel: 'esgotado', state: 'inactive' as const },
    { label: 'Lote 3', statusLabel: 'atual', state: 'active' as const },
  ];

  const planFeatures: { icon: JSX.Element; label: JSX.Element }[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
      ),
      label: <>Ouve, interpreta e <strong>responde áudios</strong></>
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
          <path d="m9 16 2 2 4-4"></path>
        </svg>
      ),
      label: <><strong>Marca consultas</strong> automaticamente</>
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="45" strokeLinecap="round" strokeLinejoin="round">
          <rect x="48" y="48" width="416" height="416" rx="64" ry="64" fill="none"></rect>
          <rect x="131" y="112" width="30" height="288" rx="32" ry="32" fill="currentColor"></rect>
          <rect x="241" y="112" width="30" height="224" rx="32" ry="32" fill="currentColor"></rect>
          <rect x="351" y="112" width="30" height="288" rx="32" ry="32" fill="currentColor"></rect>
        </svg>
      ),
      label: <><strong>CRM</strong> integrado com I.A.</>
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2 11 13"></path>
          <path d="m22 2-7 20-4-9-9-4 20-7z"></path>
        </svg>
      ),
      label: <><strong>Repescagem</strong> de conversas em 24h</>
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
      ),
      label: <><strong>Notificações</strong> inteligentes</>
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      label: <><strong>Conversas ilimitadas</strong> no WhatsApp</>
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
        </svg>
      ),
      label: <>Acesso antecipado a novas atualizações</>
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5v12L3 14v-3z"></path>
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
        </svg>
      ),
      label: <>Suporte prioritário</>
    },
  ];

  const specialOfferItems: { icon: JSX.Element; title: string; description: string }[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" stroke="currentColor" strokeWidth="23" fill="none" className="feature-icon">
          <circle cx="256" cy="256" r="200"></circle>
          <circle cx="236" cy="236" r="170"></circle>
        </svg>
      ),
      title: <b>SecretáriaPlus Go</b>,
        description: 'Único dispositivo no mundo que confirma presença por ele, faz transcrições do seu atendimento e atualiza no CRM automaticamente. (você concorrerá a 1 por sorteio)',
    },
    {
      icon: <i className="fa-brands fa-whatsapp feature-icon" aria-hidden="true" />,
      title: <b>2 Acessos WhatsApp</b>,
        description: 'Ao comprar 1 assinatura de 1 número, você terá direito a mais 1 número de WhatsApp conectado no SecretáriaPlus.',
    },
    {
      icon: (
        <img
          src="https://secretariaplus.com.br/wp-content/uploads/2024/11/saodasd.svg"
          width={20}
          height={20}
          alt="SecretáriaPlus 3.0"
          className="feature-icon"
          loading="lazy"
        />
      ),
      title: <b>SecretáriaPlus 3.0</b>,
          description: 'Terá acesso a maior atualização já feita no mercado de Inteligência Artificial para clinicas sem nenhum custo a mais. Previsão: 17 de dezembro 2025.',
    },
  ];

  const extendedOfferMessage = 'BLACK estendida até as 23h59 ou 100 vendas';
  const remainingForNextLote = 100;
  const nextLoteName = 'Lote Extra';
  const nextLotePrice = '12x197';
  const currentPriceLabel = '12x de R$ 197';
  const oldPriceLabel = '12x de R$ 297';
  const nextPriceLabel = '12x de R$ 297';

  const handlePlanClick = (planUrl: string, planName: string) => {
    console.log(`Plan selected: ${planName}`);
    window.open(planUrl, '_blank');
  };

  // Sanitizar HTML de bold (**text** -> <strong>text</strong>) e quebras de linha (\n -> <br/>)
  const sanitizeBold = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const head = sanitizeBold(offerContent.head);
  const copy1 = sanitizeBold(offerContent.copy1);
  const copy2 = sanitizeBold(offerContent.copy2);
  const copy3 = sanitizeBold(offerContent.copy3);
  const head2 = sanitizeBold(offerContent.head2);
  const copy4 = sanitizeBold(offerContent.copy4);

  // Garantir scroll livre independente de estados globais anteriores
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Mostrar botão WhatsApp após 20 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsApp(true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send?phone=5511936191391&text=Ol%C3%A1%2C%20tenho%20interesse%20na%20Black%20Secret%C3%A1riaPlus.', '_blank');
  };

  // Contagem regressiva até 23h59 de hoje
  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 0, 0);

    const formatTime = (ms: number) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (v: number) => v.toString().padStart(2, "0");
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    let timer: number | undefined;
    const updateCountdown = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      setCountdown(formatTime(diff));
      if (diff <= 0 && timer) {
        clearInterval(timer);
      }
    };

    timer = window.setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  // Loading inicial de 3 segundos
  if (showInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <img 
            src="/imgs/loader.webp" 
            alt="Loading" 
            className="w-16 h-16 object-contain"
          />
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            {name}, estamos criando uma proposta personalizada pra você...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Header preto full-width no topo sem gaps */}
      <div className="w-full bg-white text-black px-6 sm:px-8 py-6">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/imgs/logo2.svg"
            alt="logo"
            className="w-4 h-4"
          />
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] opacity-90 font-medium">
            PROPOSTA ÚNICA • Chegou a Hora
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40 py-8 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl space-y-10">
        <div className="grid gap-6">
          <div className="relative">
          <CustomCard variant="elevated" className="p-0 overflow-hidden">

            <div className="p-6 sm:p-8 space-y-8">
            {/* Foto + Headline (mobile-first: lado a lado) */}
            <div className="flex flex-row items-start gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-2xl border border-border/60 flex-shrink-0"
              >
                <img
                  src={profileImages.profilePic || "/imgs/mock1.jpg"}
                  alt={`${name} - perfil`}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="min-h-[96px] sm:min-h-[110px] flex items-start"
                >
                  <h1 className="text-2xl sm:text-3xl lg:text-[2.3rem] font-bold leading-tight text-foreground">
                    {isLoadingCopy ? (
                      <span className="opacity-50">Carregando proposta personalizada...</span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: head }} />
                    )}
                  </h1>
                </motion.div>
              </div>
            </div>

            {/* Copy curta em largura total abaixo do header - TAMANHO BASE */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="text-base text-muted-foreground leading-relaxed offer-content"
            >
              {isLoadingCopy ? (
                <span className="opacity-50">...</span>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: copy1 }} />
              )}
            </motion.p>
            </div>
          </CustomCard>
          {/* Badge circular preso ao rodapé do card (overlay real) - COMENTADO TEMPORARIAMENTE */}
          {/* <div
            className="absolute z-20 pointer-events-none"
            style={{
              width: circularBadgeConfig.size,
              height: circularBadgeConfig.size,
              right: circularBadgeConfig.offsetRight,
              top: `calc(100% + ${circularBadgeConfig.verticalGap}px)`,
              transform: "translateY(-50%)",
            }}
          >
            <SpinningCircularText
              className="text-foreground/80"
              size={circularBadgeConfig.size}
              duration={20}
              text="PROPOSTA ☆ PERSONALIZADA ☆ PROPOSTA ☆ PERSONALIZADA ☆ "
            />
            <img
              src="/imgs/logo2.svg"
              alt="logo"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                filter: "brightness(0)",
                width: circularBadgeConfig.logoSize,
                height: circularBadgeConfig.logoSize,
              }}
            />
          </div> */}
          </div>

          {/* Imagem "Como vamos te ajudar" substituída por Marquee */}
          <div className="my-0 px-0 w-full overflow-hidden bg-white py-3 border-y border-gray-100">
            <motion.div 
              className="flex whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
              style={{ width: "fit-content" }}
            >
              {Array(20).fill(`${extendedOfferMessage} • `).map((t, i) => (
                <span key={i} className="text-black font-bold text-sm sm:text-base mx-2 tracking-widest">{t}</span>
              ))}
            </motion.div>
          </div>
        </div>
            
            {/* 2ª seção: colagem de fotos do Instagram + header + texto de apoio */}
            <section className="space-y-4 mt-16 sm:mt-20">
              {/* Colagem de 3 fotos do Instagram */}
              <div className="grid grid-cols-3 gap-3 auto-rows-[72px] sm:auto-rows-[96px]">
                {/* Esquerda topo: wide, baixa */}
                <div className="col-span-2 row-span-1 rounded-xl overflow-hidden border border-border/30">
                  <img 
                    src={profileImages.post1 || "/imgs/mock2.jpg"} 
                    alt="post 1" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                {/* Direita topo: menos vertical (1 row, mais quadrado) */}
                <div className="col-span-1 row-span-1 rounded-xl overflow-hidden border border-border/30">
                  <img 
                    src={profileImages.post2 || "/imgs/mock3.jpg"} 
                    alt="post 2" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                {/* Base: wide ocupando toda a largura em baixa altura */}
                <div className="col-span-3 row-span-1 rounded-xl overflow-hidden border border-border/30">
                  <img 
                    src={profileImages.post3 || "/imgs/mock4.jpg"} 
                    alt="post 3" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              
              <div className="px-1 space-y-2">
                <h2 className="text-xl font-extrabold text-foreground offer-content">
                  {isLoadingCopy ? (
                    <span className="opacity-50">Você é incrível, mas "não é dois".</span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: copy2 }} />
                  )}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed offer-content">
                  {isLoadingCopy ? (
                    <span className="opacity-50">Entre um Ultraformer e outro, entre flores da Expoflora e o Cine Day das crianças - seu tempo escoa.</span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: copy3 }} />
                  )}
                </p>
              </div>
              
              {/* Texto destacado centralizado */}
              <p className="text-base text-center font-medium text-foreground pt-4">
                <i>Funções que escolhemos a dedo pra você 👇🏻</i>
              </p>
            </section>

            {/* Seção de Features: carrossel lateral */}
            <section className="mt-12">
              <FeatureCarousel />
            </section>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-12" />

            {/* 3ª seção: imagem clin.png + card com textos */}
            <div className="space-y-4">
              {/* Imagem que estava na seção 2 */}
              <div className="rounded-2xl overflow-hidden border border-border/40 shadow-sm bg-muted/10">
                <div className="w-full aspect-[4/1]">
                  <img
                    src="/imgs/clin.png"
                    alt="Destaque do dia"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Card apenas com os textos */}
              <CustomCard variant="elevated" className="p-4 sm:p-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-extrabold text-foreground offer-content">
                    {isLoadingCopy ? (
                      <span className="opacity-50">Seus posts estão conquistando atenção</span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: head2 }} />
                    )}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed offer-content">
                    {isLoadingCopy ? (
                      <span className="opacity-50">Imagine voltar do consultório e encontrar 5 agendamentos prontos. Sem áudios. Sem caos. Só notificações de conquistas.</span>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: copy4 }} />
                    )}
                  </p>
                </div>
              </CustomCard>
            </div>

            {/* Review: Dra. Fernanda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <CustomCard variant="bordered" className="p-4 hover:shadow-lg transition-all duration-300 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img 
                        src="/imgs/fernanda.webp" 
                        alt="Dra. Fernanda Rabelo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Dra. Fernanda Rabelo</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Cirurgia Plástica</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-3">
                      "Investimos por aqui mais de 20 mil em tráfego e a secretaria plus arrebenta com os leads"
                    </p>
                  </div>
                </div>
              </CustomCard>
            </motion.div>

            {/* Spinning text como elemento standalone entre seções */}
            <div className="flex justify-center items-center py-8">
              <div className="relative" style={{ width: circularBadgeConfig.size, height: circularBadgeConfig.size }}>
                <SpinningCircularText
                  className="text-foreground/80"
                  size={circularBadgeConfig.size}
                  duration={20}
                  text="PROPOSTA ☆ ÚNICA ☆ PROPOSTA ☆ ÚNICA ☆ "
                />
                <img
                  src="/imgs/logo2.svg"
                  alt="logo"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    filter: "brightness(0) invert(1)",
                    width: circularBadgeConfig.logoSize,
                    height: circularBadgeConfig.logoSize,
                  }}
                />
              </div>
            </div>

            {/* 4ª seção: Headline + subtexto + 2 cards de planos */}
            <div className="space-y-8" id="plans-section">
              <div className="text-center space-y-3 px-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {name ? (
                    <><span className="bg-gray-900 text-white px-2 py-1 rounded">{name}</span>, por isso formulamos essa proposta pra você ✍🏻</>
                  ) : (
                    <>Por isso formulamos essa proposta pra você ✍🏻</>
                  )}
                </h2>
                <p className="text-base text-foreground font-base leading-relaxed">
                  Simples: todas as funcionalidades liberadas, fácil de configurar e sem pegadinhas.
                </p>
              </div>

              <button
                onClick={() => handlePlanClick('https://pay.hub.la/4vKjlCIm6mnGZugbaX4m', 'BLACK Estendida')}
                className="lote-one-btn w-full font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 text-base"
              >
                <span className="tracking-[0.12em]">BLACK ESTENDIDA acaba em {countdown}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="relative">
                <CustomCard
                  variant="elevated"
                  className="plan-card featured relative overflow-hidden border border-[#0f0d0b] bg-white text-gray-900 px-6 sm:px-10 py-10 shadow-[0_25px_60px_rgba(0,0,0,0.12)] rounded-[32px]"
                >
                  <div className="relative space-y-8">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="best-option-tag bg-black text-white px-4 py-1 text-[11px] font-bold uppercase">
                        ★ Melhor Opção ★
                      </div>
                      <h3 className="text-2xl tracking-[0.25em] font-semibold uppercase">BLACK ANUAL</h3>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                        {extendedOfferMessage}
                      </span>
                    </div>

                    <ul className="plan-features space-y-3 text-left">
                      {planFeatures.map(({ icon, label }, index) => (
                        <li key={index} className="text-sm text-gray-800 leading-relaxed flex items-center gap-3">
                          <span className="text-gray-900 w-5 h-5 inline-flex items-center justify-center">
                            {icon}
                          </span>
                          <span>{label}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="special-offer-box space-y-4">
                      <h4 className=" uppercase text-[12px] font-[400] tracking-[1px] border-b border-gray-200 pb-2 mb-2">
                        <strong>Oferta Especial BLACK:</strong>
                      </h4>
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3 w-full space-y-4">
                          <img
                            src="https://flow.secretariaplus.com.br/imgs/splusgo1.jpg"
                            alt="Secretária Plus Go"
                            className="w-full rounded-2xl border border-gray-200"
                            loading="lazy"
                          />
                        </div>
                        <ul className="flex-1 space-y-4">
                          {specialOfferItems.map(({ icon, title, description }) => (
                            <li key={title} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                              <div className="flex items-center justify-center flex-shrink-0">
                                {icon}
                              </div>
                              <div>
                                <strong className="block mb-1">{title}</strong>
                                <span className="text-sm text-gray-600">{description}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="price-info-block">
                      <span className="old-price-strikethrough">
                        Preço normal: ~{oldPriceLabel}~
                      </span>
                      <div className="current-price-large">
                        {currentPriceLabel}
                      </div>
                      <span className="price-subtitle">
                        Apenas 1 paciente a mais/mês já se paga.
                      </span>
                    </div>

                    <button
                      onClick={() => handlePlanClick('https://pay.hub.la/4vKjlCIm6mnGZugbaX4m', 'BLACK Anual')}
                      className="plan-btn primary w-full bg-black text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg hover:-translate-y-0.5 transition-transform"
                    >
                      Assinar Agora
                      <ArrowRight className="w-5 h-5" />
                      <span className="button-timer text-xs uppercase tracking-widest"></span>
                    </button>

                    <div className="plan-users-badge flex items-center justify-center gap-3 text-xs text-gray-600">
                      <img
                        src="https://secretariaplus.com.br/wp-content/uploads/2024/07/Usuarios.png"
                        alt="Usuários"
                        width={90}
                        height={24}
                        loading="lazy"
                        className="object-contain"
                      />
                      <span>+1000 usuários</span>
                    </div>
                  </div>
                </CustomCard>
              </div>

            </div>
          </div>
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
      </>
    );
  };
