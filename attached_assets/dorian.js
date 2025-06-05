import { EMOTIONS, EMOTION_LIST, EMOTION_ID_TO_NAME, terrainZones, getZone } from "./emotions.js";

const canvas = document.getElementById("dorian-canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const COLS = 200;
const ROWS = 200;
const CELL_SIZE = WIDTH / COLS;
const MAX_AGE = 800;
const MUTATION_CHANCE = 0.002;
const FPS = 60;

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
      const [r, g, b] = base.map(v => Math.min(255, v * fade));
      ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
      ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
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

seed(COLS >> 1, ROWS >> 1);

function loop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let row of grid) {
    for (let cell of row) {
      cell.evaluate(getNeighbors(cell.x, cell.y));
    }
  }

  for (let row of grid) {
    for (let cell of row) {
      cell.draw();
    }
  }

  requestAnimationFrame(loop);
}

loop();
