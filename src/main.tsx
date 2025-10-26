import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ChatDebug } from './pages/ChatDebug.tsx'
import './index.css'
import './styles/chat-mobile.css'
import './styles/chat-isolated.css'

// Check if debug mode
const isDebugMode = window.location.pathname === '/debug-chat';

// Global debug command
(window as any).openDebugChat = () => {
  window.location.href = '/debug-chat';
};

console.log('💡 Debug disponível: openDebugChat()');

createRoot(document.getElementById("root")!).render(
  isDebugMode ? <ChatDebug /> : <App />
);