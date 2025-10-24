import { CustomCard } from "@/components/ui/custom-card";
import { useSupabaseDemo } from "@/hooks/useSupabaseDemo";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Sparkles, Settings, Calendar, MessageSquare, Bell, ArrowRight, Database, CheckCircle, Plus, Flame, ChevronRight } from "lucide-react";

const mockOfferContent = {
  head: "Você não nasceu pra ser secretária",
  copy1: "Seu trabalho exige dedicação total. Mas quem cuida do WhatsApp enquanto você atende?",
  copy2: "Seu tempo é valioso",
  copy3: "Entre consultas, procedimentos e a vida pessoal — cada minuto conta.",
  head2: "Você merece mais tempo para o que importa",
  copy4: "Imagine voltar do consultório e encontrar tudo organizado. Sem áudios pendentes. Sem caos. Só resultados.",
};

// Mapeamento de features por ID
type FeatureId = 'config' | 'agenda' | 'followup' | 'notif' | 'crm' | 'whatsapp';
type PainPoint = 'no-secretary' | 'bad-secretary' | 'high-demand' | 'scale-revenue';

interface Feature {
  id: FeatureId;
  icon: typeof Sparkles;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  painPoints: PainPoint[]; // quais dores essa feature resolve
}

const allFeatures: Record<FeatureId, Feature> = {
  'config': {
    id: 'config',
    icon: Sparkles,
    iconColor: 'text-gray-700',
    bgColor: 'bg-gray-100',
    title: 'Totalmente personalizável',
    description: 'Ela fala como você. Ensine procedimentos, horários e tom de voz.',
    painPoints: ['no-secretary', 'bad-secretary', 'scale-revenue']
  },
  'agenda': {
    id: 'agenda',
    icon: Calendar,
    iconColor: 'text-gray-700',
    bgColor: 'bg-gray-100',
    title: 'Agenda sozinha 24h',
    description: 'Pacientes marcam direto, mesmo de madrugada.',
    painPoints: ['no-secretary', 'high-demand', 'scale-revenue']
  },
  'followup': {
    id: 'followup',
    icon: MessageSquare,
    iconColor: 'text-gray-700',
    bgColor: 'bg-gray-100',
    title: 'Follow-up automático',
    description: 'Reconquiste os desistentes sem gastar energia.',
    painPoints: ['no-secretary', 'bad-secretary', 'high-demand']
  },
  'notif': {
    id: 'notif',
    icon: Bell,
    iconColor: 'text-gray-700',
    bgColor: 'bg-gray-100',
    title: 'Te avisa só do importante',
    description: 'Emergências e novos agendamentos. Zero ruído.',
    painPoints: ['no-secretary', 'high-demand', 'scale-revenue']
  },
  'crm': {
    id: 'crm',
    icon: Database,
    iconColor: 'text-gray-700',
    bgColor: 'bg-gray-100',
    title: 'CRM que se escreve sozinho',
    description: 'Histórico completo de cada paciente sem você digitar.',
    painPoints: ['bad-secretary', 'high-demand', 'scale-revenue']
  },
  'whatsapp': {
    id: 'whatsapp',
    icon: CheckCircle,
    iconColor: 'text-gray-700',
    bgColor: 'bg-gray-100',
    title: 'Selo verificado oficial',
    description: 'WhatsApp com selo verde da Meta. Credibilidade máxima.',
    painPoints: ['bad-secretary', 'high-demand', 'scale-revenue']
  }
};

// Lógica de seleção de features baseada na dor
const getTopFeaturesForPain = (painPoint: PainPoint): FeatureId[] => {
  const mapping: Record<PainPoint, FeatureId[]> = {
    'no-secretary': ['agenda', 'followup', 'notif'], // prioriza automação total
    'bad-secretary': ['config', 'followup', 'crm'], // prioriza qualidade e controle
    'high-demand': ['agenda', 'notif', 'crm'], // prioriza escala e organização
    'scale-revenue': ['config', 'agenda', 'whatsapp'] // prioriza profissionalismo e escalabilidade
  };
  return mapping[painPoint];
};

// Card Stack - cards empilhados com drag (3 dinâmicos + 1 fixo com imagem)
const FeatureCardStack = ({ features }: { features: Feature[] }) => {
  // Card especial com imagem
  const imageCard = {
    id: 'interface',
    isStatic: true,
    title: 'Interface simples',
    description: 'Sem parafernalha tecnológica.'
  };
  
  // Inicializa com card de imagem + features (todos escuros)
  const [cards, setCards] = useState(() => {
    const allCards = [
      imageCard,
      ...features.map((feature) => ({
        ...feature,
        isDark: true // Todos os cards serão escuros
      }))
    ];
    return allCards;
  });
  
  const moveToEnd = () => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const [removed] = newCards.splice(0, 1);
      newCards.push(removed);
      return newCards;
    });
  };

  const CARD_OFFSET = 12;
  const SCALE_FACTOR = 0.03;

  return (
    <div className="space-y-6">
      {/* Card Stack Container */}
      <div className="relative flex items-center justify-center min-h-[320px]">
        <ul className="relative w-full max-w-md h-[280px]">
          {cards.map((card, index) => {
            const isStatic = 'isStatic' in card && card.isStatic;
            const canDrag = index === 0; // Apenas o primeiro card (visível) pode ser arrastado
            const isDark = 'isDark' in card && card.isDark === true;

            return (
              <motion.li
                key={card.id}
                className="absolute w-full h-full list-none"
                style={{
                  cursor: canDrag ? "grab" : "auto",
                }}
                animate={{
                  top: index * -CARD_OFFSET,
                  scale: 1 - index * SCALE_FACTOR,
                  zIndex: cards.length - index,
                }}
                drag={canDrag ? "y" : false}
                dragConstraints={{
                  top: 0,
                  bottom: 0,
                }}
                onDragEnd={(event, info) => {
                  if (canDrag && Math.abs(info.offset.y) > 50) {
                    moveToEnd();
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                whileDrag={
                  canDrag ? {
                    cursor: "grabbing",
                  } : {}
                }
              >
                {isStatic ? (
                  // Card com imagem
                  <div className="w-full h-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/20 overflow-hidden">
                    <div className="relative h-full">
                      <img 
                        src="/imgs/tela.webp" 
                        alt="Interface"
                        className="w-full h-full object-cover"
                      />
                      {/* Barra inferior */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4">
                        <h4 className="text-base font-bold text-gray-900">
                          {card.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Cards dinâmicos (features) - todos brancos com stroke e sombra
                  <div className="w-full h-full rounded-2xl bg-white border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                    {/* Icon com animação */}
                    <motion.div
                      animate={{
                        y: canDrag ? [0, -8, 0] : 0,
                      }}
                      transition={{
                        duration: 2,
                        repeat: canDrag ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                      className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gray-100"
                    >
                      {'icon' in card && (
                        <card.icon className="w-8 h-8 text-gray-700" />
                      )}
                    </motion.div>
                    
                    {/* Title */}
                    <h4 className="text-xl font-bold mb-4 text-gray-900">
                      {card.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-sm leading-relaxed text-gray-600">
                      {card.description}
                    </p>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Hint abaixo dos cards */}
      <p className="text-sm text-gray-500 text-center">
        Arraste para cima para ver a próxima
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
          className="fill-black drop-shadow-sm"
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
  const [profileImages, setProfileImages] = useState({
    profilePic: userData.realProfilePic || null,
    post1: userData.realPosts?.[0] || null,
    post2: userData.realPosts?.[1] || null,
    post3: userData.realPosts?.[2] || null,
  });

  // Estilos CSS para bolds mais escuros (sutil)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
  }, []);

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

  const name = userData.nome?.split(" ")[0] || "Nara";

  // TODO: Substituir por userData.painPoint quando implementado
  // Possíveis valores: 'no-secretary' | 'bad-secretary' | 'high-demand' | 'scale-revenue'
  const userPainPoint: PainPoint = (userData.painPoint as PainPoint) || 'no-secretary';
  
  const selectedFeatureIds = getTopFeaturesForPain(userPainPoint);
  const selectedFeatures = selectedFeatureIds.map(id => allFeatures[id]);

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

  // Mostrar botão WhatsApp após 12 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsApp(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send?phone=5511936191391&text=Oi%20Thamara.%20Acabei%20de%20fazer%20meu%20teste%20gratuito%20e%20tenho%20uma%20d%C3%BAvida%20sobre%20o%20Secret%C3%A1riaPlus.', '_blank');
  };

  return (
    <>
      {/* Header preto full-width no topo sem gaps */}
      <div className="w-full bg-gray-900 text-white px-6 sm:px-8 py-6">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/imgs/logo2.svg"
            alt="logo"
            className="w-4 h-4 invert"
          />
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] opacity-90">
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

          {/* Imagem "Como vamos te ajudar" */}
          <div className="my-0 px-0">
            <img 
              src="/imgs/como-vamos.png" 
              alt="Como vamos te ajudar a resolver isso?" 
              className="w-[80%] mx-auto"
            />
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
              <p className="text-base text-center font-bold text-foreground pt-4">
                Funções que escolhemos a dedo pra você 👇🏻
              </p>
            </section>

            {/* Seção de Features: card stack interativo */}
            <section className="mt-12">
              <FeatureCardStack features={selectedFeatures} />
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
                    filter: "brightness(0)",
                    width: circularBadgeConfig.logoSize,
                    height: circularBadgeConfig.logoSize,
                  }}
                />
              </div>
            </div>

            {/* 4ª seção: Headline + subtexto + 2 cards de planos */}
            <div className="space-y-8">
              <div className="text-center space-y-3 px-2">
                <h2 className="text-2xl font-bold text-foreground">
                  <span className="bg-gray-900 text-white px-2 py-1 rounded">{name}</span>, por isso formulamos essa proposta pra você ✍🏻
                </h2>
                <p className="text-base text-foreground font-base leading-relaxed">
                  Simples: todas as funcionalidades liberadas, fácil de configurar e sem pegadinhas.
                </p>
              </div>

              {/* Container relativo para os 2 cards */}
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                
                {/* Card 1: Plano Mensal */}
                <CustomCard variant="elevated" className="p-0 border-2 border-gray-200 bg-white flex flex-col h-full overflow-hidden">
                  {/* Lâmina fina decorativa */}
                  <div className="w-full bg-gray-900 h-1"></div>
                  
                  <div className="p-6 text-left flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Plano Mensal</h3>
                    
                    <div className="text-3xl font-bold text-gray-900 mb-6">
                      397<span className="text-lg text-gray-600">/mês</span>
                    </div>
                    
                    <div className="space-y-3 text-gray-700 mb-6 flex-1">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Configure procedimentos, seus horários, jeito de falar da IA e muito mais</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Agenda automática</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Follow up automático</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Bell className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>Notificações (emergência, agendamentos)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Database className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>CRM automático</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>WhatsApp verificado (API meta cloud)</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handlePlanClick('https://pay.hub.la/BYp9dknJxerlzZYJJLRN', 'Mensal')}
                      className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      Iniciar Agora
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </CustomCard>

                {/* Card 2: Plano Anual */}
                <CustomCard variant="elevated" className="p-6 border-2 border-gray-800 bg-gray-900 flex flex-col h-full">
                  <div className="text-left flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-3 mt-2">Plano Anual S+ Go</h3>
                    
                    <div className="mb-1">
                      <span className="text-sm text-gray-400">12x de</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-6">
                      297<span className="text-lg text-gray-400">/ano</span>
                    </div>
                    
                    <div className="space-y-3 text-gray-300 mb-6 flex-1">
                      <div className="flex items-start gap-3">
                        <Plus className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>Tudo do mensal</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Flame className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>2 meses grátis</span>
                      </div>
                      <div>
                        <div className="bg-white text-gray-900 px-3 py-2 rounded-lg inline-block">
                          <span className="font-semibold">Pré-lista S+ Go</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">
                          Veja detalhes abaixo.
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handlePlanClick('https://pay.hub.la/NdojLLBPRoAf6cedmdVr', 'Anual')}
                      className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      Iniciar Agora
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </CustomCard>
              </div>
            </div>
          </div>
        </div>

        {/* Card GO full width fora do container max-w */}
        <div className="w-full">
          <div className="w-full">
            <div className="relative bg-black">
              {/* Imagem do GO */}
              <div className="w-full">
                <img 
                  src="/imgs/splusgo1.jpg" 
                  alt="SecretáriaPlus GO" 
                  className="w-full h-auto"
                />
                  </div>

                  <div className="px-6 sm:px-8 pb-10 pt-8 text-center">
                    {/* Título principal */}
                    <h3
                      className="text-white/90 text-xl font-light tracking-wide mb-8 leading-relaxed"
                    >
                      Assine o plano anual e concorra a um{" "}
                      <span className="font-medium text-white">SecretáriaPlus Go</span> em 2026.
                    </h3>

                    {/* Subtítulo */}
                    <p
                      className="text-gray-500 text-sm font-light tracking-wide mb-10"
                    >
                      Pré-desenvolvimento: O device que será o padrão das clinicas nos próximos 3 anos. 
                    </p>

                    {/* Lista de features */}
                    <div
                      className="space-y-4 text-left max-w-md mx-auto mb-12"
                    >
                      {[
                        "Ouve suas consultas, transcreve, resume e coloca no prontuário",
                        "Sincroniza com sua SecretáriaPlus: o online fica sabendo do offline e as conversas ficam extremamente fluidas",
                        "Pergunta se o paciente compareceu à consulta, te notifica e já atualiza suas métricas"
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3"
                        >
                          <div className="w-1 h-1 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-400 text-sm leading-relaxed font-light">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tagline */}
                    <p
                      className="text-white/80 text-sm font-light tracking-wider mb-8"
                    >
                      Sua verdadeira companhia S+ 100% integrada.
                    </p>

                    {/* Vídeo animado do GO */}
                    <div
                      className="mb-8 max-w-2xl mx-auto"
                    >
                      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '2/1' }}>
                        <img 
                          src="/imgs/movie.webp" 
                          alt="SecretáriaPlus GO em ação" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div
                      className="pt-6 border-t border-gray-900"
                    >
                      <p className="text-gray-600 text-xs tracking-wide">
                        Projeto em desenvolvimento, imagens e vídeos gerados por IA
                      </p>
                    </div>
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
