import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/chat-mobile.css'
import './styles/chat-isolated.css'

createRoot(document.getElementById("root")!).render(<App />);