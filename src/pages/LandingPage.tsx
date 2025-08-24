import { useState, useEffect } from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Users, Star, Zap, MessageCircle, Calendar, Bot } from "lucide-react";

export const LandingPage = () => {
  const [liveCount, setLiveCount] = useState(() => 130 + Math.floor(Math.random() * 91)); // 130..220

  // Increment live count every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const delta = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 3) + 1); // -3..+3
        let next = prev + delta;
        if (next < 130) next = 130;
        if (next > 220) next = 220;
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInUpDelay = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g fill="none" fillRule="evenodd">
              <g fill="#f5f5f5" fillOpacity="0.4">
                <circle cx="20" cy="20" r="1" />
              </g>
            </g>
          </svg>
        </div>

        <motion.div 
          {...fadeInUp}
          className="w-full max-w-4xl text-center space-y-8 relative z-10"
        >
          {/* Logo */}
          <motion.div {...fadeInUpDelay(0.2)} className="mb-8">
            <img src="/imgs/logo2.svg" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            {...fadeInUpDelay(0.3)}
            className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
          >
            Transforme Visitantes em{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Agendamentos
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            {...fadeInUpDelay(0.4)}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Sua nova <strong>Secretária de I.A.</strong> atende múltiplos pacientes 24/7, converte leads em agendamentos e você nem percebe que é automático.
          </motion.p>

          {/* Key Stat */}
          <motion.div 
            {...fadeInUpDelay(0.5)}
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100 max-w-2xl mx-auto"
          >
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              73% dos pacientes SOMEM se você leva mais de 3 min. pra responder
            </p>
            <p className="text-muted-foreground mt-2">
              Mas com nossa I.A., você responde em segundos... mesmo dormindo.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div {...fadeInUpDelay(0.6)} className="pt-4">
            <Link to="/">
              <CustomButton size="lg" className="px-8 py-4 text-lg">
                🚀 Testar Minha I.A. GRÁTIS Agora
              </CustomButton>
            </Link>
          </motion.div>

          {/* Live counter */}
          <motion.div {...fadeInUpDelay(0.7)} className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">
                {liveCount} clínicas testando agora
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              É Frustrante, Né?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
                <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Demora pra Responder</h3>
                <p className="text-muted-foreground">
                  Você está atendendo presencialmente e não consegue responder mensagens rapidamente. Pacientes interessados simplesmente desaparecem.
                </p>
              </div>
              
              <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
                <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Múltiplos Pacientes</h3>
                <p className="text-muted-foreground">
                  Com tráfego pago, chegam vários leads ao mesmo tempo. É humanamente impossível atender todos com qualidade e rapidez.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 mt-8 border border-red-100">
              <p className="text-2xl font-bold text-foreground mb-4">
                O resultado? Pacientes que poderiam virar agendamentos simplesmente SOMEM.
              </p>
              <p className="text-muted-foreground">
                Se profissionalizar cada vez mais e perder pacientes por demora ou falta de qualidade no atendimento por mensagem...
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              A Solução: <span className="text-green-600">Rápida & Persuasiva</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              É possível atender <strong>múltiplos pacientes simultaneamente</strong> com rapidez e quebra de objeções, convertendo curiosos em agendamentos.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Resposta Instantânea</h3>
                <p className="text-sm text-muted-foreground">
                  Atende em segundos, 24/7, mesmo quando você está dormindo
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Humanizada</h3>
                <p className="text-sm text-muted-foreground">
                  Treinada com +100 mil conversas reais. Ninguém percebe que é I.A.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Converte</h3>
                <p className="text-sm text-muted-foreground">
                  Quebra objeções e agenda consultas automaticamente
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Além de Tudo Isso...
            </h2>
            <p className="text-xl text-muted-foreground">
              Uma plataforma completa para automatizar todo seu atendimento
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CRM Automático */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50"
            >
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img src="/imgs/crm.webp" alt="CRM Automático" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">CRM Automático</h3>
                <p className="text-muted-foreground">
                  Se alimenta e arrasta os cards sozinho pra você 😍 - pra quem não tem paciência de gerenciar ferramentas
                </p>
              </div>
            </motion.div>

            {/* Escuta Áudio */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50"
            >
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img src="/imgs/audio.webp" alt="Escuta Áudio" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Escuta Áudio</h3>
                <p className="text-muted-foreground">
                  Ouve áudios e responde com delay natural. Muitos clientes usam e as pessoas nem percebem que é I.A. 🤫
                </p>
              </div>
            </motion.div>

            {/* Follow Up */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50"
            >
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img src="/imgs/follow up.webp" alt="Follow Up" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Follow Up Inteligente</h3>
                <p className="text-muted-foreground">
                  Se o paciente te der um vácuo, a própria I.A. dá aquela cutucadinha pra ele voltar o papo
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Nem Percebem que é I.A. 🤫
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Treinamos nossa I.A. com <strong>+de 100 mil conversas</strong> entre recepções e pacientes, analisando o que MAIS converte avaliações.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden">
                  <img src="/imgs/adriana.webp" alt="Adriana" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "Incrível! Triplicou meus agendamentos em 2 semanas."
                </p>
                <p className="font-semibold">Dra. Adriana</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden">
                  <img src="/imgs/fernanda.webp" alt="Fernanda" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "Agora posso focar no atendimento, a I.A. resolve o resto."
                </p>
                <p className="font-semibold">Dra. Fernanda</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full overflow-hidden">
                  <img src="/imgs/danif.webp" alt="Daniel" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-muted-foreground italic mb-2">
                  "Meus pacientes elogiam a rapidez no atendimento!"
                </p>
                <p className="font-semibold">Dr. Daniel</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
              <p className="text-lg font-semibold text-foreground mb-4">
                "E você pode ter isso na sua clínica em menos de 24h"
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-green-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sem mensalidade</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Teste 100% grátis</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Configuração em 1 dia</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Teste Sua Nova <span className="text-primary">Secretária I.A.</span><br />
              <span className="text-2xl md:text-3xl font-normal">em Apenas 1 Minuto</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Treinaremos ela com base no seu Instagram automágicamente ✨
            </p>

            <div className="bg-primary/10 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-lg font-semibold text-foreground mb-2">
                🎁 Teste Grátis + Sem Compromisso
              </p>
              <p className="text-muted-foreground">
                A análise do seu perfil é feita apenas com suas informações públicas da rede social.
              </p>
            </div>

            <Link to="/">
              <CustomButton size="lg" className="px-12 py-6 text-xl">
                🚀 Começar Teste Grátis Agora
              </CustomButton>
            </Link>

            {/* Live counter */}
            <div className="flex justify-center pt-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">
                  {liveCount} clínicas testando agora
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};