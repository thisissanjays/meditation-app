import { useState } from 'react';
import { User, Crown, ChevronRight, Bell, Moon, Volume2 } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import type { MeditationGoal } from '../types';

const GOALS: { value: MeditationGoal; label: string }[] = [
  { value: 'stress', label: 'Reduce Stress' },
  { value: 'sleep', label: 'Better Sleep' },
  { value: 'focus', label: 'Improve Focus' },
  { value: 'anxiety', label: 'Manage Anxiety' },
  { value: 'self-compassion', label: 'Self-Compassion' },
  { value: 'mindfulness', label: 'Mindfulness' },
];

const DURATIONS = [5, 10, 15, 20, 30];

export default function ProfilePage() {
  const { getStreak, getTotalMinutes, getTotalSessions } = useProgress();

  const [selectedGoals, setSelectedGoals] = useState<MeditationGoal[]>(['mindfulness']);
  const [preferredDuration, setPreferredDuration] = useState(10);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [reminders, setReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleGoal = (goal: MeditationGoal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="page profile-page">
      <header className="page-header">
        <h1>Profile</h1>
      </header>

      <div className="profile-header-card">
        <div className="profile-avatar">
          <User size={32} />
        </div>
        <div>
          <h2>Meditator</h2>
          <p className="profile-subtitle">
            {getStreak()} day streak · {getTotalMinutes()} min · {getTotalSessions()} sessions
          </p>
        </div>
      </div>

      <section className="settings-section">
        <h3>
          <Crown size={18} /> Premium
        </h3>
        <div className="premium-card">
          <p>Unlock all meditations, advanced stats, and exclusive content.</p>
          <button className="btn-primary btn-premium">
            <Crown size={16} /> Upgrade — $9.99/mo
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h3>Personalization</h3>

        <div className="setting-group">
          <label>Your Goals</label>
          <div className="goal-chips">
            {GOALS.map(({ value, label }) => (
              <button
                key={value}
                className={`chip ${selectedGoals.includes(value) ? 'active' : ''}`}
                onClick={() => toggleGoal(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Preferred Duration</label>
          <div className="duration-picker">
            {DURATIONS.map((d) => (
              <button
                key={d}
                className={`chip ${preferredDuration === d ? 'active' : ''}`}
                onClick={() => setPreferredDuration(d)}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Experience Level</label>
          <div className="level-picker">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                className={`chip ${experienceLevel === level ? 'active' : ''}`}
                onClick={() => setExperienceLevel(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h3>Settings</h3>
        <div className="settings-list">
          <div className="setting-row">
            <span><Bell size={16} /> Reminders</span>
            <label className="toggle">
              <input type="checkbox" checked={reminders} onChange={() => setReminders(!reminders)} />
              <span className="slider" />
            </label>
          </div>
          <div className="setting-row">
            <span><Moon size={16} /> Dark Mode</span>
            <label className="toggle">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="slider" />
            </label>
          </div>
          <div className="setting-row">
            <span><Volume2 size={16} /> Sound</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </section>
    </div>
  );
}
