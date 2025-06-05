import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw, Construction } from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";

// Emotion emoji mapping
const getEmotionEmoji = (emotion: string): string => {
  const emojiMap: Record<string, string> = {
    'Joy': '😂',
    'Fear': '😱',
    'Anger': '🤬',
    'Calm': '😌',
    'Envy': '😒',
    'Love': '🥰',
    'Sadness': '😓',
    'Hope': '🤩',
    'Curiosity': '🤔',
    'Pride': '😏'
  };
  return emojiMap[emotion] || '🌀';
};

export default function SimulationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [showRenderOverlay, setShowRenderOverlay] = useState(false);
  const [renderPhase, setRenderPhase] = useState('');

  // Individual pulse states for each metric
  const [lastValues, setLastValues] = useState({
    generation: 0,
    activeCells: 0,
    dominantEmotion: 'Awakening',
    collisions: 0,
    resonance: 0,
    topEmotions: [] as string[]
  });
  const [pulseStates, setPulseStates] = useState({
    generation: false,
    activeCells: false,
    dominantEmotion: false,
    energy: false,
    collisions: false,
    propagation: false,
    topEmotions: false,
    worldMood: false,
    weather: false
  });

  // Additional metric calculations
  const [emotionalMetrics, setEmotionalMetrics] = useState({
    energyLevel: 0,
    collisionsPerSecond: 0,
    resonancePerSecond: 0,
    topThreeEmotions: ['Awakening', 'Calm', 'Curiosity'],
    worldMood: 'The world feels calm and expectant.',
    symbolicWeather: 'Clear skies'
  });

  const {
    stats,
    initializeSimulation
  } = useSimulation();

  // Individual metric pulse triggers with different thresholds
  useEffect(() => {
    // Generation pulse: every 10 generations
    if (stats.generation > lastValues.generation + 10) {
      setPulseStates(prev => ({ ...prev, generation: true }));
      setLastValues(prev => ({ ...prev, generation: stats.generation }));
      setTimeout(() => setPulseStates(prev => ({ ...prev, generation: false })), 800);
    }

    // Active cells pulse: significant change (20+ cells)
    if (Math.abs(stats.activeCells - lastValues.activeCells) > 20) {
      setPulseStates(prev => ({ ...prev, activeCells: true }));
      setLastValues(prev => ({ ...prev, activeCells: stats.activeCells }));
      setTimeout(() => setPulseStates(prev => ({ ...prev, activeCells: false })), 600);
    }

    // Dominant emotion pulse: when emotion changes
    if (stats.dominantEmotion !== lastValues.dominantEmotion) {
      setPulseStates(prev => ({ ...prev, dominantEmotion: true }));
      setLastValues(prev => ({ ...prev, dominantEmotion: stats.dominantEmotion }));
      setTimeout(() => setPulseStates(prev => ({ ...prev, dominantEmotion: false })), 1000);
    }
  }, [stats.generation, stats.activeCells, stats.dominantEmotion, lastValues]);

  // Calculate advanced emotional metrics
  useEffect(() => {
    if (isStarted) {
      // Energy level based on active cells and generation speed
      const energyLevel = Math.min(100, Math.round((stats.activeCells / 5) + (stats.generation / 10)));

      // Simulated collisions per second based on activity
      const collisionsPerSecond = Math.round((stats.activeCells * 0.3) + Math.random() * 10);

      // Resonance Per Second - tracks emotional state synchronization frequency
      const resonancePerSecond = Math.round((stats.activeCells * 0.2) + (stats.generation * 0.1) + Math.sin(Date.now() * 0.001) * 8 + 15);

      // Top 3 emotions (simplified simulation)
      const emotions = ['Joy', 'Fear', 'Anger', 'Calm', 'Envy', 'Love', 'Sadness', 'Hope', 'Curiosity', 'Pride'];
      const topThreeEmotions = [
        stats.dominantEmotion || 'Awakening',
        emotions[Math.floor(Math.random() * emotions.length)],
        emotions[Math.floor(Math.random() * emotions.length)]
      ].slice(0, 3);

      // World mood generation
      const moodPhrases = [
        'The world feels charged with anticipation.',
        'Emotional currents flow like gentle streams.',
        'Turbulent feelings clash beneath the surface.',
        'A symphony of emotions plays softly.',
        'The atmosphere hums with potential.',
        'Waves of feeling ripple through space.',
        'Deep currents of emotion stir slowly.'
      ];
      const worldMood = moodPhrases[Math.floor(Math.random() * moodPhrases.length)];

      // Symbolic weather
      const weatherStates = [
        'Clear skies', 'Gentle breeze', 'Storm brewing', 'Fog rolling in',
        'Lightning strikes', 'Calm before storm', 'Rainbow emerging',
        'Misty dawn', 'Thunder rumbling', 'Sunbeams breaking'
      ];
      const symbolicWeather = weatherStates[Math.floor(Math.random() * weatherStates.length)];

      setEmotionalMetrics({
        energyLevel,
        collisionsPerSecond,
        resonancePerSecond,
        topThreeEmotions,
        worldMood,
        symbolicWeather
      });

      // Trigger pulses for new metrics
      if (energyLevel > 70) {
        setPulseStates(prev => ({ ...prev, energy: true }));
        setTimeout(() => setPulseStates(prev => ({ ...prev, energy: false })), 700);
      }

      if (collisionsPerSecond > 15) {
        setPulseStates(prev => ({ ...prev, collisions: true }));
        setTimeout(() => setPulseStates(prev => ({ ...prev, collisions: false })), 500);
      }

      // Track resonance changes to only pulse on meaningful increases
      if (resonancePerSecond > lastValues.resonance + 8) {
        setPulseStates(prev => ({ ...prev, propagation: true }));
        setLastValues(prev => ({ ...prev, resonance: resonancePerSecond }));
        setTimeout(() => setPulseStates(prev => ({ ...prev, propagation: false })), 600);
      }
    }
  }, [stats, isStarted]);

  const handleStart = () => {
    if (canvasRef.current && !isStarted) {
      setIsStarting(true);
      setShowRenderOverlay(true);
      setRenderProgress(0);

      // Simulated rendering phases
      const phases = [
        { name: 'Initializing emotional grid...', duration: 800 },
        { name: 'Loading cellular automata rules...', duration: 600 },
        { name: 'Configuring memory systems...', duration: 700 },
        { name: 'Seeding initial emotional states...', duration: 500 },
        { name: 'Optimizing rendering pipeline...', duration: 400 },
        { name: 'Finalizing simulation parameters...', duration: 300 }
      ];

      let currentPhase = 0;
      let progress = 0;

      const updateProgress = () => {
        if (currentPhase < phases.length) {
          setRenderPhase(phases[currentPhase].name);
          const phaseProgress = 100 / phases.length;
          const targetProgress = (currentPhase + 1) * phaseProgress;

          const progressInterval = setInterval(() => {
            progress += 2;
            setRenderProgress(Math.min(progress, targetProgress));

            if (progress >= targetProgress) {
              clearInterval(progressInterval);
              currentPhase++;
              setTimeout(updateProgress, 100);
            }
          }, phases[currentPhase].duration / 50);
        } else {
          // Complete the rendering sequence
          setTimeout(() => {
            setRenderPhase('Rendering complete!');
            setTimeout(() => {
              setShowRenderOverlay(false);
              if (canvasRef.current) {
                initializeSimulation(canvasRef.current);
                setIsStarted(true);
              }
              setIsStarting(false);
            }, 500);
          }, 200);
        }
      };

      updateProgress();
    }
  };

  const handleReset = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setIsStarted(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Simulation Container */}
      <div className="glow-container rounded-none md:rounded-3xl p-0 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
          {/* Left Panel - Live Metrics */}
          <div className="xl:flex xl:flex-col xl:justify-center hidden">
            <div className="glow-container rounded-2xl p-6 bg-black/60 backdrop-blur-md border border-purple-500/30" style={{boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.5)'}}>
              <h4 className="text-3xl font-extrabold mb-8 text-center gradient-text tracking-tight">Live Metrics</h4>
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-xl p-6 glow-container bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-purple-400/30" style={{boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'}}>
                  <div className="text-4xl font-extrabold text-white mb-3 tracking-tight">{stats.generation || 0}</div>
                  <div className="text-purple-200 text-lg font-bold">Generations</div>
                  <div className="text-purple-300/80 text-sm mt-2 font-medium">Evolutionary cycles completed</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)'}}></div>
                </div>

                <div className="relative overflow-hidden rounded-xl p-6 glow-container bg-gradient-to-br from-pink-600/30 to-rose-800/30 border border-pink-400/30" style={{boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'}}>
                  <div className="text-4xl font-extrabold text-white mb-3 tracking-tight">{stats.activeCells || 0}</div>
                  <div className="text-pink-200 text-lg font-bold">Active Cells</div>
                  <div className="text-pink-300/80 text-sm mt-2 font-medium">Operational emotional entities</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)'}}></div>
                </div>

                <div className="relative overflow-hidden rounded-xl p-6 glow-container bg-gradient-to-br from-cyan-600/30 to-blue-800/30 border border-cyan-400/30" style={{boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'}}>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="text-3xl">{getEmotionEmoji(stats.dominantEmotion || 'Awakening')}</span>
                    <div className="text-2xl font-extrabold text-white tracking-tight">{stats.dominantEmotion || 'Awakening'}</div>
                  </div>
                  <div className="text-cyan-200 text-lg font-bold">Currently Dominant</div>
                  <div className="text-cyan-300/80 text-sm mt-2 font-medium">Current emotional climate</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="flex flex-col items-center xl:order-none">
            <div className="relative w-full max-w-lg xl:max-w-none overflow-hidden md:rounded-2xl md:shadow-2xl md:shadow-purple-500/20">
              {/* Gradient overlays for softer edges */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top gradient */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Left gradient - mobile only */}
                <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/50 via-black/25 to-transparent md:hidden"></div>
                {/* Right gradient - mobile only */}
                <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/50 via-black/25 to-transparent md:hidden"></div>
                {/* Inner glow effect */}
                <div className="absolute inset-2 border border-purple-500/10 rounded-lg md:rounded-xl pointer-events-none"></div>
              </div>

              <canvas 
                ref={canvasRef}
                id="dorian-canvas" 
                width="600" 
                height="600" 
                className="simulation-canvas rounded-none md:rounded-2xl aspect-square mb-4"
                style={{ 
                  background: isStarted ? 'transparent' : '#000',
                  width: 'calc(100% + 8px)',
                  height: 'auto',
                  marginLeft: '-4px',
                  marginRight: '-4px'
                }}
              />
              {!isStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-none md:rounded-2xl backdrop-blur-md">
                  <div className="text-center px-6 py-8">
                    <div className="text-white text-xl font-bold mb-3 tracking-wide">Ready to Begin</div>
                    <div className="text-gray-300 text-base mb-6 max-w-sm mx-auto">Click Start to watch emotions come alive</div>
                    <Button 
                      onClick={handleStart}
                      size="lg"
                      className="group relative backdrop-blur-md border-2 border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 font-semibold px-8 py-3 overflow-hidden"
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        boxShadow: '0 0 20px rgba(139, 69, 199, 0.3), 0 0 35px rgba(219, 39, 119, 0.2), 0 0 50px rgba(6, 182, 212, 0.1)',
                        animation: 'rgbGlow 3s ease-in-out infinite alternate'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center text-white">
                        <Play className="w-5 h-5 mr-3" />
                        Start Simulation
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {/* Rendering Overlay */}
              {showRenderOverlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-none md:rounded-2xl backdrop-blur-md z-10">
                  <div className="text-center px-6 py-8 max-w-md">
                    <div className="text-white text-xl font-bold mb-4 tracking-wide">Rendering Simulation</div>
                    <div className="text-gray-300 text-sm mb-6">{renderPhase}</div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/50 rounded-full h-3 mb-4 border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
                        style={{ 
                          width: `${renderProgress}%`,
                          boxShadow: '0 0 10px rgba(139, 69, 199, 0.5), 0 0 20px rgba(219, 39, 119, 0.3)'
                        }}
                      ></div>
                    </div>

                    {/* Progress Percentage */}
                    <div className="text-white text-lg font-semibold mb-2">{Math.round(renderProgress)}%</div>

                    {/* Loading Animation */}
                    <div className="flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isStarted && (
              <div className="flex flex-col items-center gap-2 mb-3">

                {/* Mobile Live Metrics */}
                <div className="xl:hidden w-full -mx-4 px-4 mb-2">
                  {/* Six Metrics - Two Rows */}
                  <div className="space-y-2">
                    {/* Row 1: Core Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`relative backdrop-blur-sm rounded-xl p-4 text-center bg-gradient-to-br from-cyan-400/10 to-purple-500/10 border border-cyan-400/20 transition-all duration-300 aspect-square flex flex-col justify-center ${pulseStates.dominantEmotion ? 'animate-pulse scale-105 shadow-2xl' : ''}`} style={{boxShadow: pulseStates.dominantEmotion ? '0 0 35px rgba(6, 182, 212, 1), 0 0 60px rgba(6, 182, 212, 0.5)' : '0 0 8px rgba(6, 182, 212, 0.2)', backgroundColor: pulseStates.dominantEmotion ? 'rgba(6, 182, 212, 0.08)' : undefined}}>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-xs">{getEmotionEmoji(stats.dominantEmotion || 'Awakening')}</span>
                          <div className="text-xs font-extrabold text-white tracking-tight">{stats.dominantEmotion || 'Awakening'}</div>
                        </div>
                        <div className="text-cyan-200 text-xs font-bold opacity-90">Dominant</div>
                      </div>

                      <div className={`relative backdrop-blur-sm rounded-xl p-4 text-center bg-gradient-to-br from-purple-400/10 to-violet-600/10 border border-purple-400/20 transition-all duration-300 aspect-square flex flex-col justify-center ${pulseStates.generation ? 'animate-pulse scale-105 shadow-2xl' : ''}`} style={{boxShadow: pulseStates.generation ? '0 0 35px rgba(168, 85, 247, 1), 0 0 60px rgba(168, 85, 247, 0.5)' : '0 0 8px rgba(168, 85, 247, 0.2)', backgroundColor: pulseStates.generation ? 'rgba(168, 85, 247, 0.08)' : undefined}}>
                        <div className="text-sm font-extrabold text-white mb-1 tracking-tight">{stats.generation || 0}</div>
                        <div className="text-purple-200 text-xs font-bold opacity-90">Generations</div>
                      </div>

                      <div className={`relative backdrop-blur-sm rounded-xl p-4 text-center bg-gradient-to-br from-pink-400/10 to-rose-500/10 border border-pink-400/20 transition-all duration-300 aspect-square flex flex-col justify-center ${pulseStates.activeCells ? 'animate-pulse scale-105 shadow-2xl' : ''}`} style={{boxShadow: pulseStates.activeCells ? '0 0 35px rgba(236, 72, 153, 1), 0 0 60px rgba(236, 72, 153, 0.5)' : '0 0 8px rgba(236, 72, 153, 0.2)', backgroundColor: pulseStates.activeCells ? 'rgba(236, 72, 153, 0.08)' : undefined}}>
                        <div className="text-sm font-extrabold text-white mb-1 tracking-tight">{stats.activeCells || 0}</div>
                        <div className="text-pink-200 text-xs font-bold opacity-90">Active Cells</div>
                      </div>
                    </div>

                    {/* Row 2: Advanced Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`relative backdrop-blur-sm rounded-xl p-4 text-center bg-gradient-to-br from-sky-300/10 to-blue-400/10 border border-sky-400/20 transition-all duration-300 aspect-square flex flex-col justify-center ${pulseStates.energy ? 'animate-pulse scale-105 shadow-2xl' : ''}`} style={{boxShadow: pulseStates.energy ? '0 0 35px rgba(56, 189, 248, 1), 0 0 60px rgba(56, 189, 248, 0.5)' : '0 0 8px rgba(56, 189, 248, 0.2)', backgroundColor: pulseStates.energy ? 'rgba(56, 189, 248, 0.08)' : undefined}}>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-1">
                          <div className="bg-sky-300 h-1.5 rounded-full transition-all duration-500" style={{width: `${emotionalMetrics.energyLevel}%`}}></div>
                        </div>
                        <div className="text-xs font-extrabold text-white">{emotionalMetrics.energyLevel}%</div>
                        <div className="text-sky-100 text-xs font-bold opacity-90">Energy</div>
                      </div>

                      <div className={`relative backdrop-blur-sm rounded-xl p-4 text-center bg-gradient-to-br from-rose-300/10 to-pink-400/10 border border-rose-400/20 transition-all duration-300 aspect-square flex flex-col justify-center ${pulseStates.collisions ? 'animate-pulse scale-105 shadow-2xl' : ''}`} style={{boxShadow: pulseStates.collisions ? '0 0 35px rgba(244, 114, 182, 1), 0 0 60px rgba(244, 114, 182, 0.5)' : '0 0 8px rgba(244, 114, 182, 0.2)', backgroundColor: pulseStates.collisions ? 'rgba(244, 114, 182, 0.08)' : undefined}}>
                        <div className="text-sm font-extrabold text-white mb-1 tracking-tight">{emotionalMetrics.collisionsPerSecond}</div>
                        <div className="text-rose-100 text-xs font-bold opacity-90">Collisions/s</div>
                      </div>

                      <div className={`relative backdrop-blur-sm rounded-xl p-4 text-center bg-gradient-to-br from-violet-300/10 to-purple-400/10 border border-violet-400/20 transition-all duration-300 aspect-square flex flex-col justify-center ${pulseStates.propagation ? 'animate-pulse scale-105 shadow-2xl' : ''}`} style={{boxShadow: pulseStates.propagation ? '0 0 35px rgba(167, 139, 250, 1), 0 0 60px rgba(167, 139, 250, 0.5)' : '0 0 8px rgba(167, 139, 250, 0.2)', backgroundColor: pulseStates.propagation ? 'rgba(167, 139, 250, 0.08)' : undefined}}>
                        <div className="text-sm font-extrabold text-white mb-1 tracking-tight">{emotionalMetrics.resonancePerSecond}</div>
                        <div className="text-violet-100 text-xs font-bold opacity-90">Resonance/s</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Right Panel - System Analysis */}
          <div className="xl:flex xl:flex-col xl:justify-center space-y-6">
            <div className="glow-container rounded-2xl p-6 bg-black/60 backdrop-blur-md hidden xl:block" style={{boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.5)'}}>
              <h4 className="text-3xl font-extrabold mb-8 text-center gradient-text tracking-tight">System Analysis</h4>
              <div className="space-y-6">
                <div className={`relative overflow-hidden rounded-xl p-6 glow-container bg-gradient-to-br from-emerald-400/70 to-green-500/70 transition-all duration-300 ${pulseStates.activeCells ? 'animate-pulse scale-105' : ''}`} style={{boxShadow: pulseStates.activeCells ? '0 0 40px rgba(34, 197, 94, 0.9), 0 0 80px rgba(16, 185, 129, 0.7)' : '0 0 25px rgba(34, 197, 94, 0.7)'}}>
                  <div className="text-3xl font-extrabold text-white mb-3 tracking-tight">{Math.min(99, Math.round((stats.activeCells || 0) / 16))}%</div>
                  <div className="text-green-200 text-lg font-bold">Activity Level</div>
                  <div className="text-green-300/80 text-sm mt-2 font-medium">Cellular engagement rate</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'}}></div>
                </div>

                <div className={`relative overflow-hidden rounded-xl p-6 glow-container bg-gradient-to-br from-yellow-400/70 to-orange-500/70 transition-all duration-300 ${pulseStates.generation ? 'animate-pulse scale-105' : ''}`} style={{boxShadow: pulseStates.generation ? '0 0 40px rgba(245, 158, 11, 0.9), 0 0 80px rgba(249, 115, 22, 0.7)' : '0 0 25px rgba(245, 158, 11, 0.7)'}}>
                  <div className="text-2xl font-extrabold text-white mb-3 tracking-tight">{stats.generation > 100 ? 'Advanced' : stats.generation > 50 ? 'Developing' : 'Emerging'}</div>
                  <div className="text-yellow-200 text-lg font-bold">Evolution Stage</div>
                  <div className="text-yellow-300/80 text-sm mt-2 font-medium">Complexity progression</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{boxShadow: '0 0 10px rgba(245, 158, 11, 0.8)'}}></div>
                </div>

                <div className={`relative overflow-hidden rounded-xl p-6 glow-container bg-gradient-to-br from-indigo-400/70 to-blue-500/70 transition-all duration-300 ${pulseStates.dominantEmotion ? 'animate-pulse scale-105' : ''}`} style={{boxShadow: pulseStates.dominantEmotion ? '0 0 40px rgba(99, 102, 241, 0.9), 0 0 80px rgba(59, 130, 246, 0.7)' : '0 0 25px rgba(99, 102, 241, 0.7)'}}>
                  <div className="text-2xl font-extrabold text-white mb-3 tracking-tight">{stats.fps > 45 ? 'Optimal' : stats.fps > 30 ? 'Stable' : 'Limited'}</div>
                  <div className="text-indigo-200 text-lg font-bold">Performance</div>
                  <div className="text-indigo-300/80 text-sm mt-2 font-medium">Rendering efficiency</div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-400 rounded-full animate-pulse" style={{boxShadow: '0 0 10px rgba(99, 102, 241, 0.8)'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}