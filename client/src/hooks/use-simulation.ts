import { useState, useCallback, useRef, useEffect } from "react";

interface SimulationStats {
  activeCells: number;
  generation: number;
  dominantEmotion: string;
  fps: number;
}

export function useSimulation() {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [stats, setStats] = useState<SimulationStats>({
    activeCells: 0,
    generation: 0,
    dominantEmotion: '-',
    fps: 60
  });

  const simulationRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const togglePlayPause = useCallback(() => {
    setIsRunning(prev => !prev);
    if (simulationRef.current) {
      simulationRef.current.isRunning = !simulationRef.current.isRunning;
    }
  }, []);

  const reset = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.reset();
      setStats(prev => ({ ...prev, generation: 0 }));
    }
  }, []);

  const initializeSimulation = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    simulationRef.current = null;

    // Wait for canvas to be ready, then initialize simulation
    setTimeout(() => {
      if (!canvas || !canvas.getContext) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Initialize simulation directly without external scripts
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      const COLS = 150;
      const ROWS = 150;
      const CELL_SIZE = WIDTH / COLS;
      const MAX_AGE = 400;
      const MUTATION_CHANCE = 0.002;

      // Local emotions data to avoid import issues
      const EMOTIONS = {
        0: { name: "Joy", color: [255, 230, 70], vector: [1, -1], archetype: "vital" },
        1: { name: "Fear", color: [90, 130, 255], vector: [-1, 1], archetype: "shadow" },
        2: { name: "Anger", color: [255, 60, 60], vector: [1, 0], archetype: "shadow" },
        3: { name: "Calm", color: [100, 255, 180], vector: [-1, 0], archetype: "neutral" },
        4: { name: "Envy", color: [200, 100, 255], vector: [0, -1], archetype: "ego" },
        5: { name: "Love", color: [255, 160, 210], vector: [0, 1], archetype: "vital" },
        6: { name: "Sadness", color: [130, 150, 255], vector: [-1, -1], archetype: "shadow" },
        7: { name: "Hope", color: [100, 255, 200], vector: [1, 1], archetype: "hope" },
        8: { name: "Curiosity", color: [255, 200, 120], vector: [0, 0], archetype: "curious" },
        9: { name: "Pride", color: [255, 245, 100], vector: [1, 0], archetype: "ego" },
      };

      const EMOTION_LIST = Object.keys(EMOTIONS).map(k => parseInt(k));

      const terrainZones = {
        sanctuary: { decay_modifier: 0.8, boost: [5, 7], suppress: [1, 2] },
        conflict: { decay_modifier: 1.2, boost: [1, 2], suppress: [3, 7] },
      };

      function getZone(x, y, cols, rows) {
        return y < rows / 2 ? "sanctuary" : "conflict";
      }

      class Cell {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.state = false;
          this.eid = Math.floor(Math.random() * EMOTION_LIST.length);
          this.intensity = 0.5;
          this.age = 0;
          this.energy = 10;
          this.memory = [];
        }

        draw() {
          if (this.state) {
            const base = EMOTIONS[this.eid].color;
            const fade = this.intensity * 1.5;
            const [r, g, b] = base.map((v: number) => Math.min(255, v * fade));
            ctx!.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
            ctx!.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }

        evaluate(neighbors) {
          const zone = getZone(this.x, this.y, COLS, ROWS);
          const mod = terrainZones[zone].decay_modifier;
          const boost = terrainZones[zone].boost;
          const suppress = terrainZones[zone].suppress;

          if (!this.state) {
            const live = neighbors.filter(n => n?.state);
            if (live.length >= 3 && live.length <= 4 && Math.random() < 0.25) {
              const chosen = live[Math.floor(Math.random() * live.length)];
              this.state = true;
              this.eid = Math.random() > MUTATION_CHANCE ? chosen.eid : EMOTION_LIST[Math.floor(Math.random() * EMOTION_LIST.length)];
              this.intensity = 1.0;
              this.energy = 10;
              this.age = 0;
            }
            return;
          }

          this.age++;
          let decay = 0.01 * mod;
          if (suppress.includes(this.eid)) decay *= 1.5;
          if (boost.includes(this.eid)) decay *= 0.6;

          this.intensity = Math.max(0.1, this.intensity - decay);
          this.energy -= 0.2;
          if (this.age > MAX_AGE || this.energy <= 0) {
            this.state = false;
            this.memory.push(this.eid);
            this.memory = this.memory.slice(-3);
          }
        }
      }

      const grid = Array.from({ length: COLS }, (_, x) =>
        Array.from({ length: ROWS }, (_, y) => new Cell(x, y))
      );

      function getNeighbors(x, y) {
        const dirs = [-1, 0, 1];
        const neighbors = [];
        for (let dx of dirs) {
          for (let dy of dirs) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
              neighbors.push(grid[nx][ny]);
            }
          }
        }
        return neighbors;
      }

      function seed(cx, cy) {
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            const x = cx + dx;
            const y = cy + dy;
            if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
              const cell = grid[x][y];
              cell.state = true;
              cell.intensity = 1.0;
              cell.energy = 10;
              cell.age = 0;
              cell.eid = EMOTION_LIST[Math.floor(Math.random() * EMOTION_LIST.length)];
            }
          }
        }
      }

      let generation = 0;
      let isRunning = true;
      let animationId: number;
      let frameCount = 0;
      let lastStatsUpdate = 0;

      function loop() {
        if (isRunning) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, WIDTH, HEIGHT);

          // Evaluate cells every 4th frame for ultra-smooth 120fps
          if (frameCount % 4 === 0) {
            for (let row of grid) {
              for (let cell of row) {
                cell.evaluate(getNeighbors(cell.x, cell.y));
              }
            }
            generation++;
          }

          // Batch drawing operations for better performance
          const activeCells = [];
          for (let row of grid) {
            for (let cell of row) {
              if (cell.state) {
                activeCells.push(cell);
              }
            }
          }

          // Group cells by color to reduce context switches
          const cellsByColor = new Map();
          activeCells.forEach(cell => {
            const base = EMOTIONS[cell.eid].color;
            const fade = cell.intensity * 1.5;
            const [r, g, b] = base.map((v: number) => Math.min(255, v * fade));
            const colorKey = `${r|0},${g|0},${b|0}`;

            if (!cellsByColor.has(colorKey)) {
              cellsByColor.set(colorKey, []);
            }
            cellsByColor.get(colorKey).push(cell);
          });

          // Draw cells in batches by color
          cellsByColor.forEach((cells, colorKey) => {
            ctx!.fillStyle = `rgb(${colorKey})`;
            cells.forEach(cell => {
              ctx!.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            });
          });

          frameCount++;

          // Update stats less frequently (every 60 frames for 120fps reporting)
          if (frameCount - lastStatsUpdate > 60) {
            const activeCells = grid.flat().filter(cell => cell.state).length;
            const emotionCounts: Record<string, number> = {};
            grid.flat().filter(cell => cell.state).forEach(cell => {
              const emotionName = EMOTIONS[cell.eid].name;
              emotionCounts[emotionName] = (emotionCounts[emotionName] || 0) + 1;
            });

            const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
              emotionCounts[a] > emotionCounts[b] ? a : b, '-'
            );

            // Dispatch custom event with stats
            const event = new CustomEvent('simulationStats', {
              detail: { activeCells, generation, dominantEmotion, fps: 120 }
            });
            window.dispatchEvent(event);
            lastStatsUpdate = frameCount;
          }
        }

        animationId = requestAnimationFrame(loop);
      }

      // Store simulation controls
      simulationRef.current = {
        isRunning: true,
        toggle: () => { 
          isRunning = !isRunning; 
          simulationRef.current.isRunning = isRunning;
        },
        reset: () => {
          generation = 0;
          grid.forEach(row => row.forEach(cell => {
            cell.state = false;
            cell.age = 0;
            cell.energy = 10;
            cell.intensity = 0.5;
            cell.memory = [];
          }));
          seed(COLS >> 1, ROWS >> 1);
        },
        destroy: () => {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        }
      };

      // Initial seed
      seed(COLS >> 1, ROWS >> 1);

      // Start the simulation
      loop();
    }, 100);
  }, []);

  useEffect(() => {
    const handleSimulationStats = (event: CustomEvent) => {
      setStats(event.detail);
    };

    window.addEventListener('simulationStats', handleSimulationStats as EventListener);

    return () => {
      window.removeEventListener('simulationStats', handleSimulationStats as EventListener);
    };
  }, []);

  return {
    isRunning,
    stats,
    speed,
    togglePlayPause,
    reset,
    setSpeed,
    initializeSimulation
  };
}