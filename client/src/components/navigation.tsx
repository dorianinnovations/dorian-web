import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NavigationProps {
  activeSection: string;
}

// Elegant hamburger to grid transformation
const AnimatedMenuIcon = ({ isOpen, size = 24, className = "" }: { isOpen: boolean; size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="menuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    
    {/* Symmetrical grid pattern */}
    <g style={{ 
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'center'
    }}>
      {/* Top row */}
      <rect
        x="4"
        y="6"
        width="6"
        height="2"
        rx="1"
        fill="url(#menuGradient)"
        style={{
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.8)',
        }}
      />
      <rect
        x="14"
        y="6"
        width="6"
        height="2"
        rx="1"
        fill="url(#menuGradient)"
        style={{
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.8)',
        }}
      />
      
      {/* Middle row - main line that persists */}
      <rect
        x="4"
        y="11"
        width={isOpen ? "6" : "16"}
        height="2"
        rx="1"
        fill="url(#menuGradient)"
        style={{
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <rect
        x="14"
        y="11"
        width="6"
        height="2"
        rx="1"
        fill="url(#menuGradient)"
        style={{
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.8)',
        }}
      />
      
      {/* Bottom row */}
      <rect
        x="4"
        y="16"
        width={isOpen ? "6" : "16"}
        height="2"
        rx="1"
        fill="url(#menuGradient)"
        style={{
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <rect
        x="14"
        y="16"
        width="6"
        height="2"
        rx="1"
        fill="url(#menuGradient)"
        style={{
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1)' : 'scale(0.8)',
        }}
      />
    </g>
  </svg>
);

export default function Navigation({ activeSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 80 : 100; // Account for navigation height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'rules', label: 'Rules' },
    { id: 'mechanics', label: 'Mechanics' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Connect with me' }
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-out ${
        isScrolled ? 'bg-black/20 backdrop-blur-lg border-b border-purple-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-12 md:justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:w-full md:justify-center">
            <div className="flex items-center space-x-1 glow-container rounded-full p-1 bg-black/40 backdrop-blur-md border border-purple-500/20" style={{boxShadow: '0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.4)'}}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ease-out transform ${
                    activeSection === item.id 
                      ? 'text-white bg-gradient-to-r from-purple-600/60 to-cyan-600/60 shadow-2xl scale-105 border border-purple-400/30' 
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 hover:scale-105 hover:shadow-lg'
                  }`}
                  style={activeSection === item.id ? {
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 10px rgba(168, 85, 247, 0.1)'
                  } : {}}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button - Centered */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-pink-400 transition-all duration-300 hover:bg-purple-500/20 p-2 border border-transparent hover:border-purple-400/30"
              style={{
                transform: isMenuOpen ? 'scale(1.05)' : 'scale(1)',
                background: isMenuOpen ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                boxShadow: isMenuOpen ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
              }}
            >
              <div className="relative">
                <AnimatedMenuIcon 
                  isOpen={isMenuOpen} 
                  size={24} 
                  className="flex-shrink-0 transition-all duration-300 transform" 
                />
              </div>
            </Button>
          </div>
        </div>
        
        {/* Mobile menu with enhanced glowing dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMenuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-8'
        }`}>
          <div 
            className="glow-container rounded-2xl rounded-b-3xl mx-4 my-4 p-6 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl border border-purple-500/40 transition-all duration-500 ease-out"
            style={{
              boxShadow: isMenuOpen 
                ? '0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(236, 72, 153, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.6)'
                : '0 0 0px rgba(168, 85, 247, 0), 0 0 0px rgba(236, 72, 153, 0), inset 0 0 0px rgba(0, 0, 0, 0)',
              transform: isMenuOpen ? 'scale(1) rotateX(0deg)' : 'scale(0.95) rotateX(-10deg)',
              transformOrigin: 'top center'
            }}
          >
            <div className="space-y-3">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative w-full text-left px-6 py-4 rounded-xl text-lg font-bold transition-all duration-300 ease-out transform ${
                    activeSection === item.id 
                      ? 'text-white bg-gradient-to-r from-purple-600/70 to-cyan-600/70 shadow-2xl scale-105 border border-purple-400/50' 
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-pink-600/40 hover:scale-102 hover:shadow-lg'
                  }`}
                  style={{
                    transform: isMenuOpen 
                      ? `translateY(0px) scale(1)` 
                      : `translateY(${-20 - (index * 10)}px) scale(0.9)`,
                    opacity: isMenuOpen ? 1 : 0,
                    transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms',
                    transitionDuration: '400ms',
                    ...(activeSection === item.id ? {
                      boxShadow: '0 0 25px rgba(168, 85, 247, 0.7), 0 0 50px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)'
                    } : {
                      boxShadow: 'none'
                    })
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="tracking-wide">{item.label}</span>
                    {activeSection === item.id && (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)'}}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.3s', boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)'}}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.6s', boxShadow: '0 0 8px rgba(6, 182, 212, 0.8)'}}></div>
                      </div>
                    )}
                  </div>
                  {activeSection === item.id && (
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 rounded-full animate-pulse" style={{boxShadow: '0 0 12px rgba(168, 85, 247, 0.8)'}} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
