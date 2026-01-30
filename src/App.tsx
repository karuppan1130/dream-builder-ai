import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import BlueprintEditor from "@/pages/BlueprintEditor";
import Viewer3D from "@/pages/Viewer3D";
import NotFound from "@/pages/NotFound";
import { voiceAssistant, type VoiceCommand } from "@/lib/voiceAssistant";

const queryClient = new QueryClient();

const AppContent = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ta'>('en');
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing'>('idle');

  useEffect(() => {
    voiceAssistant.onStateChanged(setVoiceState);
    voiceAssistant.onCommandReceived((cmd: VoiceCommand) => {
      console.log('Voice command:', cmd);
      // Handle commands here
    });
  }, []);

  const handleLanguageChange = (lang: 'en' | 'ta') => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    voiceAssistant.setLanguage(lang);
  };

  const handleVoiceToggle = () => {
    voiceAssistant.toggleListening();
  };

  return (
    <>
      <Navbar
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
        onVoiceToggle={handleVoiceToggle}
        voiceState={voiceState}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<BlueprintEditor />} />
        <Route path="/viewer" element={<Viewer3D />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
