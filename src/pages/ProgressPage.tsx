import { useProgress } from '../hooks/useProgress';
import { Flame, Clock, Trophy, TrendingUp } from 'lucide-react';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProgressPage() {
  const { getStreak, getTotalMinutes, getWeeklyProgress, getTotalSessions } = useProgress();

  const streak = getStreak();
  const totalMinutes = getTotalMinutes();
  const totalSessions = getTotalSessions();
  const weekly = getWeeklyProgress();
  const maxMinutes = Math.max(...weekly.map((d) => d.totalMinutes), 1);

  return (
    <div className="page progress-page">
      <header className="page-header">
        <h1>Your Progress</h1>
      </header>

      <div className="stats-grid">
        <div className="stat-card large">
          <Flame size={28} className="stat-icon streak" />
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-card large">
          <Clock size={28} className="stat-icon time" />
          <span className="stat-value">{totalMinutes}</span>
          <span className="stat-label">Total Minutes</span>
        </div>
        <div className="stat-card large">
          <Trophy size={28} className="stat-icon sessions" />
          <span className="stat-value">{totalSessions}</span>
          <span className="stat-label">Sessions</span>
        </div>
        <div className="stat-card large">
          <TrendingUp size={28} className="stat-icon weekly" />
          <span className="stat-value">
            {weekly.reduce((s, d) => s + d.totalMinutes, 0)}
          </span>
          <span className="stat-label">This Week (min)</span>
        </div>
      </div>

      <section className="section">
        <h2>This Week</h2>
        <div className="weekly-chart">
          {weekly.map((day) => {
            const date = new Date(day.date + 'T12:00:00');
            const dayLabel = DAY_LABELS[date.getDay()];
            const height = day.totalMinutes > 0 ? (day.totalMinutes / maxMinutes) * 100 : 4;
            return (
              <div key={day.date} className="chart-bar-container">
                <div className="chart-bar-wrapper">
                  <div
                    className={`chart-bar ${day.completed ? 'filled' : ''}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="chart-label">{dayLabel}</span>
                {day.totalMinutes > 0 && (
                  <span className="chart-value">{day.totalMinutes}m</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {totalSessions === 0 && (
        <div className="empty-state-card">
          <p>No sessions yet. Start your first meditation to begin tracking!</p>
        </div>
      )}
    </div>
  );
}
