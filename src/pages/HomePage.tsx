import { useMeditations } from '../hooks/useMeditations';
import { useProgress } from '../hooks/useProgress';
import MeditationCard from '../components/MeditationCard';
import { Flame, Clock, Trophy } from 'lucide-react';

export default function HomePage() {
  const { meditations, loading } = useMeditations();
  const { getStreak, getTotalMinutes, getTotalSessions } = useProgress();

  const streak = getStreak();
  const totalMinutes = getTotalMinutes();
  const totalSessions = getTotalSessions();
  const greeting = getGreeting();

  if (loading) {
    return <div className="page loading">Loading...</div>;
  }

  const categories = [...new Set(meditations.map((m) => m.category))];

  return (
    <div className="page home-page">
      <header className="page-header">
        <h1>{greeting}</h1>
        <p className="subtitle">Take a moment for yourself today.</p>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <Flame size={20} className="stat-icon streak" />
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-card">
          <Clock size={20} className="stat-icon time" />
          <span className="stat-value">{totalMinutes}</span>
          <span className="stat-label">Minutes</span>
        </div>
        <div className="stat-card">
          <Trophy size={20} className="stat-icon sessions" />
          <span className="stat-value">{totalSessions}</span>
          <span className="stat-label">Sessions</span>
        </div>
      </div>

      <section className="section">
        <h2>Recommended for You</h2>
        <div className="horizontal-scroll">
          {meditations.filter((m) => !m.isPremium).slice(0, 4).map((m) => (
            <MeditationCard key={m.id} meditation={m} compact />
          ))}
        </div>
      </section>

      {categories.map((cat) => (
        <section key={cat} className="section">
          <h2>{cat}</h2>
          <div className="horizontal-scroll">
            {meditations.filter((m) => m.category === cat).map((m) => (
              <MeditationCard key={m.id} meditation={m} compact />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
