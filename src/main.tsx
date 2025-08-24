import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import { LandingPage } from "./pages/LandingPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import './index.css'
import './styles/chat-mobile.css'
import './styles/chat-isolated.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/lp" element={<LandingPage />} />
        <Route path="/" element={<App />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);