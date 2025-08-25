import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bot, Clock, MessageCircle, Sparkles, Zap, Heart, Calendar, Check } from "lucide-react";

export const LandingPage = () => {
  const navigate = useNavigate();
  const [accessCount, setAccessCount] = useState(26);

  useEffect(() => {
    const interval = setInterval(() => {
      setAccessCount(prev => {
        const delta = Math.random() < 0.7 ? -1 : 1;
        let next = prev + delta;
        if (next < 20) next = 20;
        if (next > 35) next = 35;
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/30">
      {/* Fold 1 - Hero */}
      <section className="relative h-screen flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g fill="none" fillRule="evenodd">
              <g fill="#f5f5f5" fillOpacity="0.4">
                <circle cx="20" cy="20" r="1" />
              </g>
            </g>
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center space-y-6 relative z-10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-card rounded-2xl shadow-lg flex items-center justify-center">
              <img src="/imgs/logo2.svg" alt="Logo" className="w-10 h-10" />
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight"
          >
            Sua <span className="text-primary">"Recepção Invisível"</span> para Harmonização Orofacial
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Conversa como uma secretária sênior, quebra objeções de HOF e agenda protocolos e Full Faces no automático.
          </motion.p>

          {/* Prova mini */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/10 rounded-2xl p-4 max-w-lg mx-auto"
          >
            <p className="text-foreground font-medium">+500 clínicas de HOF no Brasil</p>
            <p className="text-muted-foreground text-sm mt-1">Ninguém percebe que é I.A.</p>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 pt-4"
          >
            <CustomButton 
              onClick={handleCTA}
              size="lg" 
              className="text-white bg-black hover:bg-gray-900 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
            >
              Quero ver funcionando →
            </CustomButton>
            <p className="text-xs text-muted-foreground">na próxima tela você faz um teste grátis com o @ do seu Instagram</p>
          </motion.div>

          {/* Bullets compactos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6"
          >
            <div className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
              <MessageCircle className="w-6 h-6 text-primary mb-2 mx-auto" />
              <p className="text-xs text-foreground">Responde "qual valor do botox?", "quantos mls?", "dói?" com linguagem premium</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
              <Sparkles className="w-6 h-6 text-primary mb-2 mx-auto" />
              <p className="text-xs text-foreground">Sugere avaliação e conduz para toxina, preenchedores, bioestimuladores e Full Face</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-soft border border-border/50">
              <Clock className="w-6 h-6 text-primary mb-2 mx-auto" />
              <p className="text-xs text-foreground">Integra com sua agenda e atende 24/7 (texto e áudio)</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Fold 2 - Como ela vende HOF */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="title-section text-foreground mb-4">
              Treinada no seu Instagram e nos seus protocolos
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">1. Cole seu @</h3>
              <p className="text-muted-foreground">Mapeamos tom de voz, antes/depois e procedimentos.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">2. A I.A. aprende HOF</h3>
              <p className="text-muted-foreground">Perguntas sobre toxina x preenchedor, mls, edema, recuperação, parcelamento.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">3. Qualifica e agenda</h3>
              <p className="text-muted-foreground">No WhatsApp, quebra objeções típicas e agenda direto na sua agenda.</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="bg-card rounded-2xl p-6 max-w-lg mx-auto shadow-soft border border-border/50">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Responde áudios e mantém elegância – não é "robozinho".
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fold 3 - Prova & impacto */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="title-section text-foreground mb-6">
              O custo de demorar no Whats para HOF
            </h2>
            <div className="bg-destructive/10 rounded-2xl p-6 max-w-2xl mx-auto mb-12">
              <p className="text-2xl font-bold text-destructive mb-2">73%</p>
              <p className="text-foreground">dos leads somem após 3 min sem resposta</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Mais Full Faces fechados</h3>
              <p className="text-sm text-muted-foreground">fora do horário comercial</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">Protocolos lábios + mento</h3>
              <p className="text-sm text-muted-foreground">marcados sem intervenção humana</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">A linguagem convence</h3>
              <p className="text-sm text-muted-foreground">sem parecer bot</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-primary/10 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Garantia 30 dias</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Se não notar ganho real em eficiência/agendamentos, devolvemos 100%
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fold 4 - Convite para experiência */}
      <section className="py-20 px-4 bg-gradient-to-t from-muted/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="title-section text-foreground">
              Veja a Recepção Invisível trabalhando com a sua clínica
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Acesso de demonstração liberado diariamente.
            </p>

            <div className="space-y-6">
              <CustomButton 
                onClick={handleCTA}
                size="lg" 
                className="text-white bg-black hover:bg-gray-900 px-16 py-6 text-2xl font-semibold transform hover:scale-105 transition-all duration-300"
              >
                Ir para a demonstração →
              </CustomButton>

              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">
                  Acessos liberados hoje: {accessCount}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            SecretáriaPlus - Sua recepção invisível para HOF
          </p>
        </div>
      </footer>
    </div>
  );
};