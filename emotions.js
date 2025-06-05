export const EMOTIONS = {
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

export const EMOTION_LIST = Object.keys(EMOTIONS).map(k => parseInt(k));
export const EMOTION_ID_TO_NAME = Object.fromEntries(
  Object.entries(EMOTIONS).map(([k, v]) => [parseInt(k), v.name])
);

export const terrainZones = {
  sanctuary: { decay_modifier: 0.8, boost: [5, 7], suppress: [1, 2] },
  conflict: { decay_modifier: 1.2, boost: [1, 2], suppress: [3, 7] },
};

export function getZone(x, y, cols, rows) {
  return y < rows / 2 ? "sanctuary" : "conflict";
}
