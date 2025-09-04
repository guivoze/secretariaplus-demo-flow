# Microsoft Clarity - Setup Guide

## 📊 O que é o Microsoft Clarity?

O Microsoft Clarity é uma ferramenta gratuita de análise comportamental que oferece:
- **Session Replays**: Gravações de sessões dos usuários
- **Heatmaps**: Mapas de calor mostrando onde os usuários clicam
- **Insights**: Análises inteligentes do comportamento
- **Clarity Copilot**: IA que fornece resumos e insights acionáveis

## 🚀 Configuração

### 1. Criar conta no Clarity
1. Acesse [clarity.microsoft.com](https://clarity.microsoft.com/)
2. Faça login com sua conta Microsoft
3. Clique em "Create new project"
4. Preencha as informações do seu site

### 2. Obter o Project ID
1. No dashboard do Clarity, vá para seu projeto
2. Clique em **Settings** > **Overview**
3. Copie o **Project ID** (formato: XXXXXXXXXX)

### 3. Configurar no projeto
1. Crie um arquivo `.env.local` na raiz do projeto:
```bash
cp .env.local.example .env.local
```

2. Edite o arquivo `.env.local` e adicione seu Project ID:
```env
REACT_APP_CLARITY_PROJECT_ID=SEU_PROJECT_ID_AQUI
```

### 4. Verificar instalação
1. Execute o projeto: `npm run dev`
2. Abra o console do navegador
3. Deve aparecer: "Microsoft Clarity initialized with project ID: SEU_ID"

## 📈 Eventos Trackados Automaticamente

### Navegação por Steps
- `step_1_viewed`, `step_2_viewed`, etc.
- Tag `current_step` com o número do step atual

### Conversões (Step 16)
- `plan_clicked_basic` - Clique no plano Basic
- `plan_clicked_pro` - Clique no plano Pro
- Tag `conversion_intent` com o nome do plano
- Sessões são automaticamente "upgraded" para priorizar gravação

## 🔧 Funções Disponíveis

### Hook useClarity
```typescript
const clarity = useClarity({ projectId: 'SEU_ID' });

// Tracking de eventos personalizados
clarity.trackEvent('custom_event_name');

// Tags personalizadas
clarity.setTag('user_type', 'premium');

// Identificar usuários
clarity.identify('user_123', 'session_456', 'page_789', 'Nome Amigável');

// Priorizar sessão para gravação
clarity.upgradeSession('important_interaction');
```

## 📊 Dados Coletados

### Automaticamente
- Cliques, movimentos do mouse, scrolls
- Tempo na página, navegação entre páginas
- Dimensões da tela, tipo de dispositivo
- Erros JavaScript

### Personalizados (via código)
- Steps visitados pelo usuário
- Tentativas de conversão
- Tipo de plano selecionado
- Informações do formulário (sem dados sensíveis)

## 🔒 Privacidade e Segurança

- ✅ O Clarity automaticamente mascare dados sensíveis
- ✅ IPs são anonimizados
- ✅ Não coleta dados pessoais identificáveis
- ✅ Compatível com LGPD/GDPR
- ✅ Dados processados por hash no cliente

## 📱 Monitoramento Recomendado

### KPIs Principais
1. **Taxa de conclusão por step** - Quantos usuários chegam ao final
2. **Drop-off points** - Onde os usuários abandonam o funil
3. **Tempo por step** - Quais steps demoram mais
4. **Taxa de conversão** - % que clica nos planos
5. **Preferência de planos** - Basic vs Pro

### Dashboards Úteis
- **Funnel Analysis** - Visualizar o funil completo
- **Heatmaps** - Quais elementos são mais clicados
- **Session Recordings** - Ver sessões de usuários que converteram vs que não converteram

## 🚨 Troubleshooting

### Clarity não inicializa
- Verificar se o Project ID está correto no `.env.local`
- Verificar se o arquivo `.env.local` está na raiz do projeto
- Reiniciar o servidor de desenvolvimento

### Eventos não aparecem
- Aguardar alguns minutos (delay normal do Clarity)
- Verificar console do navegador por erros
- Confirmar que o Project ID está ativo no dashboard

### Performance
- O Clarity tem impacto mínimo na performance
- Carrega de forma assíncrona
- Não bloqueia a renderização da página

## 📞 Suporte

- Email: clarityms@microsoft.com
- Documentação: [learn.microsoft.com/clarity](https://learn.microsoft.com/en-us/clarity/)
- Status: [status.clarity.microsoft.com](https://status.clarity.microsoft.com/)
