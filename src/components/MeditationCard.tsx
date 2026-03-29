import { useNavigate } from 'react-router-dom';
import { Clock, Lock } from 'lucide-react';
import type { Meditation } from '../types';

interface Props {
  meditation: Meditation;
  compact?: boolean;
}

export default function MeditationCard({ meditation, compact }: Props) {
  const navigate = useNavigate();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <button
      className={`meditation-card ${compact ? 'compact' : ''}`}
      onClick={() => navigate(`/meditate/${meditation.id}`)}
    >
      <div
        className="card-thumbnail"
        style={{ backgroundImage: `url(${meditation.thumbnail})` }}
      >
        {meditation.isPremium && (
          <span className="premium-badge">
            <Lock size={12} /> Premium
          </span>
        )}
      </div>
      <div className="card-info">
        <h3>{meditation.title}</h3>
        {!compact && <p>{meditation.description}</p>}
        <div className="card-meta">
          <span className="card-duration">
            <Clock size={14} /> {formatDuration(meditation.duration)}
          </span>
          <span className="card-category">{meditation.category}</span>
        </div>
      </div>
    </button>
  );
}
