import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, Lock } from 'lucide-react';
import { useMeditations } from '../hooks/useMeditations';
import { useProgress } from '../hooks/useProgress';

export default function MeditatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById } = useMeditations();
  const { addSession } = useProgress();

  const meditation = getById(id || '');

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'low' | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const startTimeRef = useRef<string>('');

  const steps = meditation?.media.textSteps || [];

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = startTimeRef.current || new Date().toISOString();
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (meditation && next >= meditation.duration) {
            setIsPlaying(false);
            setCompleted(true);
            clearInterval(intervalRef.current);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, meditation]);

  useEffect(() => {
    if (steps.length === 0) return;
    let idx = -1;
    for (let i = steps.length - 1; i >= 0; i--) {
      if (elapsed >= steps[i].timestamp) { idx = i; break; }
    }
    if (idx >= 0) setCurrentStepIndex(idx);
  }, [elapsed, steps]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const skipStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setElapsed(nextStep.timestamp);
    }
  }, [currentStepIndex, steps]);

  const handleComplete = useCallback(() => {
    if (mood && meditation) {
      addSession({
        meditationId: meditation.id,
        userId: 'local-user',
        startedAt: startTimeRef.current,
        completedAt: new Date().toISOString(),
        duration: elapsed,
        mood,
      });
      navigate('/progress');
    }
  }, [mood, meditation, elapsed, addSession, navigate]);

  if (!meditation) {
    return (
      <div className="page">
        <p>Meditation not found.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  // Freemium gate
  const isPremiumLocked = meditation.isPremium; // In prod, check user.isPremium

  if (isPremiumLocked) {
    return (
      <div className="page meditate-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <div
          className="player-bg locked"
          style={{ backgroundImage: `url(${meditation.media.backgroundImage})` }}
        >
          <div className="premium-overlay">
            <Lock size={48} />
            <h2>Premium Content</h2>
            <p>{meditation.title}</p>
            <p className="premium-desc">
              Unlock this and all premium meditations with a subscription.
            </p>
            <button className="btn-primary" onClick={() => navigate('/profile')}>
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="page meditate-page completion-screen">
        <div className="completion-content">
          <h1>Session Complete</h1>
          <p className="completion-duration">
            {Math.floor(elapsed / 60)} min {elapsed % 60} sec
          </p>
          <p>How are you feeling?</p>
          <div className="mood-picker">
            {(['great', 'good', 'okay', 'low'] as const).map((m) => (
              <button
                key={m}
                className={`mood-btn ${mood === m ? 'selected' : ''}`}
                onClick={() => setMood(m)}
              >
                {m === 'great' && '😊'}
                {m === 'good' && '🙂'}
                {m === 'okay' && '😐'}
                {m === 'low' && '😔'}
                <span>{m}</span>
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            disabled={!mood}
            onClick={handleComplete}
          >
            Save & Continue
          </button>
        </div>
      </div>
    );
  }

  const progress = meditation.duration > 0 ? (elapsed / meditation.duration) * 100 : 0;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="page meditate-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      <div
        className="player-bg"
        style={{ backgroundImage: `url(${meditation.media.backgroundImage})` }}
      >
        <div className="player-overlay">
          <h2 className="player-title">{meditation.title}</h2>
          <p className="player-instructor">with {meditation.instructor}</p>

          <div className="guided-text">
            <p className="instruction" key={currentStepIndex}>
              {currentStep?.instruction}
            </p>
          </div>

          <div className="player-timer">
            {formatTime(elapsed)} / {formatTime(meditation.duration)}
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="player-controls">
            <button className="control-btn play-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button className="control-btn" onClick={skipStep}>
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
