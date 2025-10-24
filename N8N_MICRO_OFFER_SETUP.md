# 🎯 Setup do Webhook Micro-Offer no n8n

## ✅ O que foi implementado no Frontend

### 1. **Step7Form** - Formulário com dropdown
- Adicionado campo de seleção "Qual seu MAIOR problema hoje?"
- Opções mapeadas para valores:
  - `no-secretary` → "😭 Não tenho secretária/auxiliar..."
  - `bad-secretary` → "🐌 Tenho secretária mas ela é 'lentinha'..."
  - `high-demand` → "🎯 Rodo anúncios e não aguento a alta demanda..."
  - `scale-revenue` → "💸 Está tudo certo, só quero ganhar mais dinheiro!"

- Ao submeter o formulário, faz chamada para:
  ```
  POST https://n8nsplus.up.railway.app/webhook/micro-offer
  ```

  **Body:**
  ```json
  {
    "session_id": "abc123_1729700000000",
    "pain_point": "no-secretary"
  }
  ```

  **Resposta esperada (IMPORTANTE - retornar no mesmo webhook):**
  ```json
  {
    "offer_copy": {
      "head_father": "Nara, você não é uma secretária de luxo",
      "copy_father": "4 mil pessoas acompanham...",
      "head1": "Seu MPT Day foi incrível...",
      "copy1": "Primeira clínica com...",
      "head2": "Deixa a Nara ser Nara",
      "copy2": "Imagina acordar sabendo..."
    }
  }
  ```

### 2. **Step16SketchOffer** - Página da oferta
- Busca `offer_copy` do **localStorage** (salvo quando o webhook responde)
- Fallback para mock se não encontrar
- Sanitização de markdown bold (`**text**` → `<strong>text</strong>`)
- Renderização com `dangerouslySetInnerHTML`
- Features selecionadas baseadas no `painPoint` do usuário

---

## 🔧 O que você precisa fazer no n8n

### **Node 1: Webhook (micro-offer)**
- **Path:** `/micro-offer`
- **Method:** POST
- **Response Mode:** `responseNode` ⚠️ **IMPORTANTE**

**Recebe:**
```json
{
  "session_id": "abc123_1729700000000",
  "pain_point": "no-secretary"
}
```

---

### **Node 2: Code (Sanitize Bold)**
Antes de processar com a LLM, crie um Code node para sanitizar markdown bold:

```javascript
// Sanitize markdown bold (**text**) to HTML <strong>text</strong>
const input = $input.first().json;

// Função para sanitizar
function sanitizeBold(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Se vier wrapped em ```json, limpar
let cleanOutput = input.output || JSON.stringify(input);
cleanOutput = cleanOutput.replace(/```json\n|\n```/g, '');

// Parse do JSON
const data = JSON.parse(cleanOutput);

// Sanitizar cada campo
Object.keys(data).forEach(key => {
  if (typeof data[key] === 'string') {
    data[key] = sanitizeBold(data[key]);
  }
});

return [{ json: data }];
```

---

### **Node 3: AI Agent (Anthropic Claude Opus 4.1)**
Use o mesmo modelo do AI Agent 3 atual, mas:

**System Prompt:** (Use o que você já tem, mas adicione o pain_point no contexto)

```
# MAIOR dificuldade atual do lead:
{{ $('Webhook').item.json.body.pain_point }}

# Dados do perfil:
{{ JSON.stringify($('rapidapi4').item.json, null, 2) }}

# Legendas dos ultimos posts:
{{ JSON.stringify($('formatar dados llm').item.json, null, 2) }}
```

**Resposta esperada (JSON):**
```json
{
  "head_father": "...",
  "copy_father": "...",
  "head1": "...",
  "copy1": "...",
  "head2": "...",
  "copy2": "..."
}
```

---

### **Node 4: Parse JSON**
```javascript
const raw = $input.first().json.output;
const cleanedOutput = raw.replace(/```json\n|\n```/g, '');
const parsed = JSON.parse(cleanedOutput);
return [{ json: parsed }];
```

---

### **Node 5: Sanitize Bold (Code)**
```javascript
const data = $input.first().json;

function sanitizeBold(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

Object.keys(data).forEach(key => {
  if (typeof data[key] === 'string') {
    data[key] = sanitizeBold(data[key]);
  }
});

return [{ json: data }];
```

---

### **Node 6: Respond to Webhook** ⚠️ **CRÍTICO**
Retornar EXATAMENTE neste formato:

```json
{
  "offer_copy": {
    "head_father": "{{ $('Sanitize Bold').item.json.head_father }}",
    "copy_father": "{{ $('Sanitize Bold').item.json.copy_father }}",
    "head1": "{{ $('Sanitize Bold').item.json.head1 }}",
    "copy1": "{{ $('Sanitize Bold').item.json.copy1 }}",
    "head2": "{{ $('Sanitize Bold').item.json.head2 }}",
    "copy2": "{{ $('Sanitize Bold').item.json.copy2 }}"
  }
}
```

⚠️ **Não adicione Update Supabase** - o frontend pega direto da resposta!

---

## 📊 Fluxo Completo

```
Webhook (micro-offer)
  ↓
AI Agent (Claude Opus 4.1)
  ↓
Parse JSON
  ↓
Sanitize Bold (Code)
  ↓
Respond to Webhook (offer_copy)
  ↓
Frontend salva no localStorage
  ↓
Step16 carrega do localStorage
```

---

## 🧪 Teste Manual

### 1. Enviar request de teste:
```bash
curl -X POST https://n8nsplus.up.railway.app/webhook/micro-offer \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session_123",
    "pain_point": "no-secretary"
  }'
```

### 2. Resposta esperada:
```json
{
  "offer_copy": {
    "head_father": "Nara, você não é uma secretária de luxo",
    "copy_father": "4 mil pessoas acompanham seu Ultraformer MPT...",
    "head1": "Seu MPT Day foi incrível, mas você não é três",
    "copy1": "Primeira clínica com <strong>Ultraformer MPT</strong>...",
    "head2": "Deixa a Nara ser Nara",
    "copy2": "Imagina acordar sabendo que <strong>3 novos pacientes</strong>..."
  }
}
```

### 3. Frontend irá:
- Receber a resposta
- Salvar em `localStorage.setItem('offer-copy', JSON.stringify(data.offer_copy))`
- Carregar no Step16 e renderizar

---

## 🎨 Como o Frontend Usa

1. **Step7Form** envia webhook e **espera resposta**
2. Quando recebe, salva `offer_copy` no **localStorage**
3. Usuário continua o fluxo (chat demo)
4. **Step16SketchOffer** carrega do localStorage
5. Renderiza com `dangerouslySetInnerHTML` para processar `<strong>`
6. Se não encontrar, usa conteúdo mock (graceful fallback)

---

## 🚨 Importante

- ⚠️ **Retornar a resposta no mesmo webhook** (não usar Update Supabase)
- A LLM pode demorar 20-40s, mas está OK (usuário está no chat)
- Frontend salva no localStorage para não perder se recarregar página
- Se webhook falhar, usa mock (graceful degradation)

---

## ✨ Variáveis de Pain Point

Mapeamento frontend → LLM:
- `no-secretary` → "Não tenho secretária/auxiliares. É difícil dar atenção para tudo ao mesmo tempo."
- `bad-secretary` → "Tenho secretária mas ela é 'lentinha' - Não converte e não aprende."
- `high-demand` → "Rodo anúncios e não aguento a alta demanda de leads"
- `scale-revenue` → "Está tudo certo, só quero ganhar mais dinheiro!"

Use isso no system prompt para personalizar a copy baseado na dor específica.
