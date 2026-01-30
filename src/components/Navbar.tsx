import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Building2, 
  LayoutDashboard, 
  PenTool, 
  Box, 
  Settings,
  Menu,
  X,
  Globe,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavbarProps {
  onLanguageChange: (lang: 'en' | 'ta') => void;
  currentLanguage: 'en' | 'ta';
  onVoiceToggle: () => void;
  voiceState: 'idle' | 'listening' | 'processing';
}

const Navbar = ({ onLanguageChange, currentLanguage, onVoiceToggle, voiceState }: NavbarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Building2 },
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/editor', label: t('nav.editor'), icon: PenTool },
    { path: '/viewer', label: t('nav.viewer'), icon: Box },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-sidebar-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Building2 className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">
              BuildPlan<span className="text-accent">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "blueprint" : "ghost"}
                    className={`gap-2 ${!isActive(item.path) ? 'text-sidebar-foreground hover:text-white' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Voice Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onVoiceToggle}
              className={`relative ${voiceState === 'listening' ? 'text-accent' : 'text-sidebar-foreground hover:text-white'}`}
            >
              <Mic className="w-5 h-5" />
              {voiceState === 'listening' && (
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-accent"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLanguageChange(currentLanguage === 'en' ? 'ta' : 'en')}
              className="gap-2 text-sidebar-foreground hover:text-white"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-mono text-xs">{currentLanguage}</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-sidebar-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-sidebar border-t border-sidebar-border"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "blueprint" : "ghost"}
                    className={`w-full justify-start gap-2 ${!isActive(item.path) ? 'text-sidebar-foreground' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
