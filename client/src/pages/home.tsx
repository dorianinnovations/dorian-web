import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Info, Sun, VenetianMask, Scale, Crown, MapPin, ServerCog, Github, Twitter, Plus, Brain, Network, Zap, Map as MapIcon, ChevronUp, Code2 } from "lucide-react";
import Navigation from "@/components/navigation";
import SimulationCanvas from "@/components/simulation-canvas";
import EmotionCard from "@/components/emotion-card";

const EMOTIONS = {
  0: { id: 0, name: "Joy", color: [255, 230, 70] as [number, number, number], vector: [1, -1] as [number, number], archetype: "vital" },
  1: { id: 1, name: "Fear", color: [90, 130, 255] as [number, number, number], vector: [-1, 1] as [number, number], archetype: "shadow" },
  2: { id: 2, name: "Anger", color: [255, 60, 60] as [number, number, number], vector: [1, 0] as [number, number], archetype: "shadow" },
  3: { id: 3, name: "Calm", color: [100, 255, 180] as [number, number, number], vector: [-1, 0] as [number, number], archetype: "neutral" },
  4: { id: 4, name: "Envy", color: [200, 100, 255] as [number, number, number], vector: [0, -1] as [number, number], archetype: "ego" },
  5: { id: 5, name: "Love", color: [255, 160, 210] as [number, number, number], vector: [0, 1] as [number, number], archetype: "vital" },
  6: { id: 6, name: "Sadness", color: [130, 150, 255] as [number, number, number], vector: [-1, -1] as [number, number], archetype: "shadow" },
  7: { id: 7, name: "Hope", color: [100, 255, 200] as [number, number, number], vector: [1, 1] as [number, number], archetype: "hope" },
  8: { id: 8, name: "Curiosity", color: [255, 200, 120] as [number, number, number], vector: [0, 0] as [number, number], archetype: "curious" },
  9: { id: 9, name: "Pride", color: [255, 245, 100] as [number, number, number], vector: [1, 0] as [number, number], archetype: "ego" },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showBackButton, setShowBackButton] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const handleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.section-fade, section[id]');
    sections.forEach(el => observer.observe(el));

    // Throttled scroll handler for better performance - only for non-interactive elements
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        // Only apply scroll effects to non-interactive scroll-reactive elements
        const scrollCards = document.querySelectorAll('.scroll-reactive:not(.cursor-pointer)');
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const viewportCenter = scrollY + windowHeight / 2;

        scrollCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + scrollY + rect.height / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          const intensity = Math.max(0, 1 - (distance / (windowHeight / 2)));

          card.classList.remove('scroll-glow', 'scroll-glow-intense');
          
          if (intensity > 0.7) {
            card.classList.add('scroll-glow-intense');
          } else if (intensity > 0.3) {
            card.classList.add('scroll-glow');
          }
        });
        
        // Check back button visibility
        const simulationElement = document.getElementById("simulation");
        const heroElement = document.getElementById("hero");
        
        if (simulationElement && heroElement) {
          const simulationBottom = simulationElement.offsetTop + simulationElement.offsetHeight;
          const isInHero = scrollY < heroElement.offsetHeight;
          setShowBackButton(scrollY > simulationBottom && !isInHero);
        }
        
        scrollTimeout = null as any;
      }, 16); // ~60fps throttle
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = window.innerWidth < 768 ? 80 : 100; // Increased offset for proper clearance
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Navigation activeSection={activeSection} />
      
      {/* Return to Visual Button - Mobile Only */}
      {showBackButton && (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <Button 
            onClick={() => scrollToSection('simulation')}
            className="group relative w-12 h-12 rounded-full backdrop-blur-md border-2 border-white/10 hover:border-white/20 text-white overflow-hidden transition-all duration-500 hover:scale-110"
            size="sm"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              boxShadow: '0 0 15px rgba(139, 69, 199, 0.3), 0 0 25px rgba(219, 39, 119, 0.2), 0 0 35px rgba(6, 182, 212, 0.1)',
              animation: 'rgbGlow 2s ease-in-out infinite alternate'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <ChevronUp className="h-4 w-4" />
            </div>
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden scroll-snap-align-start">
        <div className="hero-gradient absolute inset-0"></div>
        
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl floating-orb"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full opacity-20 blur-xl floating-orb"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500 to-lime-500 rounded-full opacity-20 blur-xl floating-orb"></div>
        
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12 items-center">
            {/* Left decorative element - desktop only */}
            <div className="hidden xl:flex flex-col items-center space-y-6">
              <div className="w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/20">
                <Zap className="w-12 h-12 text-white/80" />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-lg">Real-time</div>
                <div className="text-gray-400 text-sm">Evolution</div>
              </div>
            </div>

            {/* Center content */}
            <div className="xl:col-span-1 text-center">
              <div className="relative inline-block">
                {/* Animated glow background */}
                <div 
                  className="absolute inset-0 rounded-full blur-3xl opacity-70"
                  style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 40%, rgba(6, 182, 212, 0.2) 70%, transparent 100%)',
                    animation: 'radialGlow 4s ease-in-out infinite',
                    transform: 'scale(1.2)',
                    zIndex: -1
                  }}
                />
                
                <h1 className="text-6xl md:text-8xl xl:text-[12rem] mb-6 md:mb-8 leading-tight tracking-tighter relative" style={{
                  color: '#ffffff',
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                  fontWeight: '800',
                  letterSpacing: '-0.03em',
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(168, 85, 247, 0.4), 0 0 90px rgba(236, 72, 153, 0.3)',
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))'
                }}>
                  Dorian
                </h1>
              </div>
              
              <div className="text-lg md:text-xl xl:text-2xl text-white/90 mb-8 md:mb-10 leading-loose max-w-4xl mx-auto px-4" style={{
                fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
                fontWeight: '300',
                lineHeight: '1.7'
              }}>
                <span 
                  className="inline-block"
                  style={{
                    opacity: 0,
                    animation: 'fadeInSequence1 0.8s ease-in 0.8s forwards'
                  }}
                >
                  Watch emotions come alive
                </span>
                <span 
                  className="inline-block"
                  style={{
                    opacity: 0,
                    animation: 'fadeInSequence2 0.8s ease-in 1.9s forwards'
                  }}
                >
                  {" "}in this interactive simulation where simple rules create{" "}
                </span>
                <span 
                  className="inline-block bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent font-normal"
                  style={{
                    opacity: 0,
                    animation: 'fadeInSequence3 0.8s ease-in 3.0s forwards'
                  }}
                >
                  complex, emergent behaviors
                </span>
                <span 
                  className="inline-block"
                  style={{
                    opacity: 0,
                    animation: 'fadeInSequence3 0.8s ease-in 3.0s forwards'
                  }}
                >
                  .
                </span>
              </div>
              <div className="flex flex-col gap-3 max-w-md">
                <Button 
                  onClick={() => scrollToSection('simulation')}
                  className="group relative w-full py-5 px-10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 rounded-full text-white font-bold text-xl overflow-hidden transition-all duration-700"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    boxShadow: '0 0 25px rgba(139, 69, 199, 0.4), 0 0 45px rgba(219, 39, 119, 0.3), 0 0 65px rgba(6, 182, 212, 0.2)',
                    animation: 'startButtonAnticipation 2.5s ease-in-out infinite, rgbGlow 3s ease-in-out infinite alternate',
                    transformOrigin: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-pink-500/20 to-cyan-500/15 opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-45 from-transparent via-white/10 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1200 skew-x-12"></div>
                  <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-cyan-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm animate-spin-slow"></div>
                  <div className="relative flex items-center justify-center gap-3 group-hover:scale-110 transition-transform duration-500">
                    <Play className="h-5 w-5 transition-all duration-300 text-white group-hover:rotate-12 group-hover:scale-125" style={{animation: 'playIconBounce 2s ease-in-out infinite'}} />
                    <span className="tracking-wide group-hover:tracking-wider transition-all duration-500">Start</span>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => scrollToSection('about')}
                  className="group relative w-full py-4 px-8 backdrop-blur-sm border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5 rounded-full font-semibold text-lg transition-all duration-500 hover:scale-105"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div className="relative flex items-center justify-center gap-3">
                    <Info className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300 text-white" />
                    <span className="text-white">
                      Learn
                    </span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Right decorative element - desktop only */}
            <div className="hidden xl:flex flex-col items-center space-y-6">
              <div className="w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/20">
                <Brain className="w-12 h-12 text-white/80" />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-lg">Emergent</div>
                <div className="text-gray-400 text-sm">Intelligence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Simulation Section */}
      <section id="simulation" className="py-12 md:py-20 relative scroll-snap-align-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-24 section-fade">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Live Emotional Simulation
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto tech-text">
              Watch emotions evolve and interact in <span className="emphasis-glow">real-time</span>
            </p>
          </div>
        </div>
        
        {/* Canvas container - edge to edge on mobile */}
        <div className="section-fade mb-12">
          <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-8">
            <SimulationCanvas />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Emotions Legend - Now directly under canvas */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 section-fade">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-white tracking-tight">
                Emotion Palette
              </h3>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
                Interactive color reference guide for the simulation
              </p>
            </div>

            <div className="glow-container rounded-2xl p-6 md:p-8 section-fade">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {Object.values(EMOTIONS).map((emotion) => (
                  <EmotionCard key={emotion.id} emotion={emotion} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Computational Rules Section */}
      <section id="rules" className="py-12 md:py-20 relative scroll-snap-align-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20 section-fade">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 gradient-text tracking-tight">
              Computational Rules
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto tech-text leading-relaxed">
              The precise mathematical logic governing cellular birth, evolution, and <span className="emphasis-gradient">emotional dynamics</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Cellular Activation & Deactivation */}
            <Card className="glow-container section-fade hover-glow hover-scale-small">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'}}>
                    <Plus className="text-white h-6 w-6 flex-shrink-0" />
                  </div>
                  <h3 className="text-3xl font-extrabold gradient-text tracking-tight">Cellular Activation & Deactivation</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="glow-container glow-accent-green rounded-xl p-6">
                    <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                      <span className="text-2xl mr-3">✨</span>Activation Rules
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start"><span className="text-green-400 mr-2">•</span>3-4 emotional neighbors trigger activation</li>
                      <li className="flex items-start"><span className="text-green-400 mr-2">•</span>25% chance per generation</li>
                      <li className="flex items-start"><span className="text-green-400 mr-2">•</span>Inherits type from neighbor</li>
                      <li className="flex items-start"><span className="text-green-400 mr-2">•</span>0.2% chance of spontaneous mutation</li>
                    </ul>
                  </div>

                  <div className="glow-container glow-accent-red rounded-xl p-6">
                    <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                      <span className="text-2xl mr-3">⚡</span>Deactivation Rules
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start"><span className="text-red-400 mr-2">•</span>800 cycle lifespan limit</li>
                      <li className="flex items-start"><span className="text-red-400 mr-2">•</span>Energy depletion threshold</li>
                      <li className="flex items-start"><span className="text-red-400 mr-2">•</span>Zero intensity termination</li>
                      <li className="flex items-start"><span className="text-red-400 mr-2">•</span>Triggers neighbor recalculation and inheritance opportunities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Memory & Persistence */}
            <Card className="glow-container section-fade hover-glow hover-scale-small">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'}}>
                    <Brain className="text-white h-6 w-6 flex-shrink-0" />
                  </div>
                  <h3 className="text-3xl font-extrabold gradient-text tracking-tight">Memory & Evolution</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="glow-container rounded-xl p-6 backdrop-blur-sm bg-black/20 border border-white/10">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">💭</span>Memory System
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start"><span className="text-white mr-2">•</span>Records strongest encountered emotion</li>
                      <li className="flex items-start"><span className="text-white mr-2">•</span>Influences neighbor interactions</li>
                      <li className="flex items-start"><span className="text-white mr-2">•</span>Affects survival probability</li>
                    </ul>
                  </div>
                  
                  <div className="glow-container rounded-xl p-6 backdrop-blur-sm bg-black/20 border border-white/10">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="text-2xl mr-3">⚡</span>Energy & Intensity
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start"><span className="text-white mr-2">•</span>Random starting energy levels</li>
                      <li className="flex items-start"><span className="text-white mr-2">•</span>Similar neighbors boost energy</li>
                      <li className="flex items-start"><span className="text-white mr-2">•</span>Strong emotions influence weak ones</li>
                      <li className="flex items-start"><span className="text-white mr-2">•</span>Creates cascading grid effects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Territory-based survival rules */}
          <Card className="glow-container section-fade mb-16">
            <CardContent className="p-8">
              <div className="flex items-center mb-6 justify-center">
                <div className="w-12 h-12 backdrop-blur-sm bg-black/20 border border-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <MapIcon className="text-white/80 h-6 w-6 flex-shrink-0" />
                </div>
                <h3 className="text-3xl font-extrabold gradient-text tracking-tight">Territorial Dynamics</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glow-container rounded-xl p-6 backdrop-blur-sm bg-black/20 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">🕊️</span>Harmony Zone (Upper)
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Gentle emotional fading</li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Love and Hope thrive</li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Fear and Anger struggle</li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Nurturing environment</li>
                  </ul>
                </div>
                
                <div className="glow-container rounded-xl p-6 backdrop-blur-sm bg-black/20 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-2xl mr-3">⚔️</span>Conflict Zone (Lower)
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Rapid emotional fading</li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Fear and Anger dominate</li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Calm and Hope weaken</li>
                    <li className="flex items-start"><span className="text-white mr-2">•</span>Challenging survival conditions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Mechanics Section */}
      <section id="mechanics" className="py-12 md:py-20 relative scroll-snap-align-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20 section-fade">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 gradient-text tracking-tight">
              From Python to Web
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto tech-text leading-relaxed">
              How this simulation evolved from prototype to <span className="emphasis-gradient">web experience</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Python Origins */}
            <Card className="glow-container section-fade hover-glow hover-scale-small">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 backdrop-blur-sm bg-black/20 border border-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Brain className="text-white/80 h-6 w-6 flex-shrink-0" />
                  </div>
                  <h3 className="text-3xl font-extrabold gradient-text tracking-tight">Python Prototype</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="glow-container glow-accent-green rounded-lg p-4 border-l-4 border-green-400">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Pygame Foundation</h4>
                    <p className="text-white text-sm leading-relaxed tech-text">
                      Initial development used Python's pygame library for <span className="emphasis-glow">rapid prototyping</span>. The cellular automata rules, memory systems, and emotional behaviors were first validated in this environment.
                    </p>
                  </div>
                  
                  <div className="glow-container glow-accent-red rounded-lg p-4 border-l-4 border-red-400">
                    <h4 className="text-lg font-semibold text-red-400 mb-2">Simple Rule Sets</h4>
                    <p className="text-white text-sm leading-relaxed tech-text">
                      Core logic established basic activation/deactivation cycles, neighbor influence calculations, and <span className="emphasis-glow">memory persistence patterns</span>. These mathematical foundations proved that <span className="emphasis-gradient">complex emotional behaviors</span> emerge from simple computational rules.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JavaScript Adaptation */}
            <Card className="glow-container section-fade hover-glow hover-scale-small">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 backdrop-blur-sm bg-black/20 border border-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Network className="text-white/80 h-6 w-6 flex-shrink-0" />
                  </div>
                  <h3 className="text-3xl font-extrabold gradient-text tracking-tight">JavaScript Translation</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="glow-container glow-accent-blue rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-2">Web Optimization</h4>
                    <p className="text-white text-sm tech-text">
                      The Python pygame logic was carefully ported to JavaScript, maintaining <span className="emphasis-glow">exact mathematical precision</span> while optimizing for browser performance and <span className="emphasis-gradient">Canvas2D rendering at 60 FPS</span>.
                    </p>
                  </div>
                  
                  <div className="glow-container glow-accent-green rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-lime-400 mb-2">Core Preservation</h4>
                    <p className="text-white text-sm tech-text">
                      All fundamental cellular automata rules from the original Python implementation remain intact - <span className="emphasis-glow">activation conditions</span>, neighbor calculations, <span className="emphasis-gradient">memory persistence</span>, and terrain zone influences operate identically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 relative scroll-snap-align-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20 section-fade">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 md:mb-8 gradient-text tracking-tight">
              What Is Dorian?
            </h2>
            <p className="text-base md:text-xl text-white max-w-3xl mx-auto tech-text">
              What started as experimental tinkering with pygame evolved into a <span className="emphasis-gradient">full-fledged simulation</span> where emotions develop, interact, and persist through <span className="emphasis-glow">complex cellular dynamics</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Card 1 - Flip Card */}
            <div className={`flip-card ${flippedCards.has('visual') ? 'flipped' : ''}`} onClick={() => handleCardFlip('visual')}>
              <div className="flip-card-inner">
                <div className="flip-card-front glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">🐍</div>
                    <h3 className="text-xl font-bold text-white mb-3">Python Origins</h3>
                    <p className="text-gray-400 text-sm">Click to discover the prototype journey</p>
                  </div>
                </div>
                <div className="flip-card-back glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-4">🐍 Pygame Prototype</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      Began as experimental tinkering with pygame to explore cellular automata and emotional dynamics.
                    </p>
                    <div className="text-purple-400 text-xs">Python • Pygame • Experimentation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Performance Struggles */}
            <div className={`flip-card ${flippedCards.has('performance') ? 'flipped' : ''}`} onClick={() => handleCardFlip('performance')}>
              <div className="flip-card-inner">
                <div className="flip-card-front glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">🌐</div>
                    <h3 className="text-xl font-bold text-white mb-3">Web Evolution</h3>
                    <p className="text-gray-400 text-sm">The journey to browser compatibility</p>
                  </div>
                </div>
                <div className="flip-card-back glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-4">🌐 JavaScript Translation</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      The simulation evolved into JavaScript to unlock web accessibility and smooth 60 FPS performance.
                    </p>
                    <div className="text-cyan-400 text-xs">JavaScript • Canvas • Optimization</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - WebAssembly Challenges */}
            <div className={`flip-card ${flippedCards.has('wasm') ? 'flipped' : ''}`} onClick={() => handleCardFlip('wasm')}>
              <div className="flip-card-inner">
                <div className="flip-card-front glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">🔧</div>
                    <h3 className="text-xl font-bold text-white mb-3">WebAssembly Hurdles</h3>
                    <p className="text-gray-400 text-sm">Explore the compilation challenges</p>
                  </div>
                </div>
                <div className="flip-card-back glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-4">🔧 WASM Complexity</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      WebAssembly proved too complex for browser integration and Canvas API access.
                    </p>
                    <div className="text-orange-400 text-xs">WebAssembly • Complexity • Friction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 - JavaScript Solution */}
            <div className={`flip-card ${flippedCards.has('solution') ? 'flipped' : ''}`} onClick={() => handleCardFlip('solution')}>
              <div className="flip-card-inner">
                <div className="flip-card-front glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-4">🔮</div>
                    <h3 className="text-xl font-bold text-white mb-3">Ongoing Vision</h3>
                    <p className="text-gray-400 text-sm">Continuous iteration and development</p>
                  </div>
                </div>
                <div className="flip-card-back glow-container cursor-pointer">
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-4">🔮 Ever-Evolving Vision</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      This is an ongoing project that continues to evolve with new features, mechanics, and possibilities.
                    </p>
                    <div className="text-purple-400 text-xs">Ongoing • Iteration • Future Development</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 relative scroll-snap-align-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20 section-fade">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 md:mb-8 gradient-text tracking-tight">
              Connect with me
            </h2>
          </div>
          
          <div className="glow-container rounded-3xl p-8 md:p-12 bg-black/40 backdrop-blur-sm text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                  Artist & Programmer exploring computational creativity and emotional systems through interactive digital experiences.
                </p>
                <p className="text-base text-gray-400">
                  I create immersive simulations that bridge technology and human emotion. Always excited to connect with fellow creators and collaborators.
                </p>
              </div>
              
              <div className="glow-container rounded-2xl p-6 md:p-8 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 border-2 border-cyan-400/30 text-center">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-4">Let's Connect</h4>
                <p className="text-gray-300 mb-6 text-sm md:text-base">Ready to collaborate on something extraordinary?</p>
                <Button 
                  className="group relative w-full px-6 py-4 rounded-full text-white font-bold text-sm md:text-lg border-2 border-transparent transition-all duration-700 overflow-hidden"
                  onClick={() => window.open('mailto:dorianinnovations@gmail.com', '_blank')}
                  style={{
                    background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 0 20px rgba(139, 69, 199, 0.4), 0 0 40px rgba(219, 39, 119, 0.3), 0 0 60px rgba(6, 182, 212, 0.2)',
                    animation: 'rgbGlow 3s ease-in-out infinite alternate, emailPulse 4s ease-in-out infinite'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full blur-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-45 from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                  <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <span className="break-all tracking-wide">dorianinnovations@gmail.com</span>
                  </div>
                </Button>
                <div className="mt-4 p-4 bg-black/20 rounded-lg border border-gray-700/30">
                  <p className="text-xs text-gray-400 mb-2 font-medium tracking-wider uppercase">Mailing Address</p>
                  <div className="text-sm text-white tech-text space-y-1">
                    <p>4390 Temecula St. Suite 12</p>
                    <p>San Diego, CA 92107</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <div className="text-xl font-bold gradient-text mb-2">Dorian</div>
            <p className="text-gray-500 text-sm">Exploring the intersection of emotion, computation, and art</p>
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-gray-600 text-xs">
                © 2025 Dorian Emotional Cellular Automata. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Patent Pending • Trademark of Dorian Innovations
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
