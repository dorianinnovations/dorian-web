import { Card, CardContent } from "@/components/ui/card";

interface EmotionCardProps {
  emotion: {
    id: number;
    name: string;
    color: [number, number, number];
    archetype: string;
    vector: [number, number];
  };
}

export default function EmotionCard({ emotion }: EmotionCardProps) {
  const [r, g, b] = emotion.color;
  const colorStyle = `rgb(${r}, ${g}, ${b})`;
  const shadowStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;

  const getArchetypeColor = (archetype: string) => {
    switch (archetype) {
      case 'vital': return 'text-yellow-400';
      case 'shadow': return 'text-purple-400';
      case 'neutral': return 'text-green-400';
      case 'ego': return 'text-pink-400';
      case 'hope': return 'text-cyan-400';
      case 'curious': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getEmotionProperties = (name: string, archetype: string) => {
    const properties = {
      'Joy': { influence: 'Expansive', tendency: 'Spreads rapidly to neighbors', intensity: 'High' },
      'Fear': { influence: 'Defensive', tendency: 'Forms clusters in conflict zones', intensity: 'Variable' },
      'Anger': { influence: 'Aggressive', tendency: 'Dominates weak emotions', intensity: 'Intense' },
      'Sadness': { influence: 'Absorbing', tendency: 'Slow decay, long memory', intensity: 'Deep' },
      'Love': { influence: 'Nurturing', tendency: 'Thrives in sanctuary zones', intensity: 'Warm' },
      'Disgust': { influence: 'Repelling', tendency: 'Creates empty boundaries', intensity: 'Sharp' },
      'Surprise': { influence: 'Catalytic', tendency: 'Triggers mutations', intensity: 'Brief' },
      'Anticipation': { influence: 'Building', tendency: 'Prepares neighboring cells', intensity: 'Growing' },
      'Trust': { influence: 'Stabilizing', tendency: 'Reduces decay rates', intensity: 'Steady' },
      'Calm': { influence: 'Peaceful', tendency: 'Slows aggressive spread', intensity: 'Gentle' }
    };
    return properties[name as keyof typeof properties] || { influence: 'Neutral', tendency: 'Balanced interaction', intensity: 'Moderate' };
  };

  const props = getEmotionProperties(emotion.name, emotion.archetype);

  return (
    <Card className="emotion-card glow-container hover:border-white/30 cursor-pointer group transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-4 text-center">
        <div 
          className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12"
          style={{ 
            backgroundColor: colorStyle, 
            boxShadow: `0 0 20px ${shadowStyle}, 0 0 40px ${shadowStyle.replace('0.4', '0.15')}, 0 0 60px ${shadowStyle.replace('0.4', '0.05')}` 
          }}
        >
          {emotion.name[0]}
        </div>
        <h3 className="text-base font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">{emotion.name}</h3>
        <div className="text-xs mb-3">
          <span className={`px-3 py-1 bg-black/50 rounded-full text-xs transition-all duration-300 group-hover:bg-black/70 ${getArchetypeColor(emotion.archetype)}`}>
            {emotion.archetype}
          </span>
        </div>
        <div className="space-y-2 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          <div>
            <span className="text-gray-500">Influence:</span> <span className="text-gray-300 font-medium">{props.influence}</span>
          </div>
          <div>
            <span className="text-gray-500">Intensity:</span> <span className="text-gray-300 font-medium">{props.intensity}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-3 leading-tight group-hover:text-gray-400 transition-colors duration-300">
          {props.tendency}
        </div>
      </CardContent>
    </Card>
  );
}
