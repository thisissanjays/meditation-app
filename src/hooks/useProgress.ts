import { useState, useCallback } from 'react';
import type { Session, DailyProgress } from '../types';

// Local state for MVP — migrate to Firestore for persistence
export function useProgress() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('meditation-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const save = (updated: Session[]) => {
    setSessions(updated);
    localStorage.setItem('meditation-sessions', JSON.stringify(updated));
  };

  const addSession = useCallback(
    (session: Omit<Session, 'id'>) => {
      const newSession = { ...session, id: crypto.randomUUID() };
      save([...sessions, newSession]);
      return newSession;
    },
    [sessions]
  );

  const getStreak = useCallback(() => {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasSession = sessions.some(
        (s) => s.completedAt && s.completedAt.startsWith(dateStr)
      );
      if (hasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [sessions]);

  const getTotalMinutes = useCallback(() => {
    return Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60);
  }, [sessions]);

  const getWeeklyProgress = useCallback((): DailyProgress[] => {
    const result: DailyProgress[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const daySessions = sessions.filter(
        (s) => s.completedAt && s.completedAt.startsWith(dateStr)
      );
      result.push({
        date: dateStr,
        sessions: daySessions.length,
        totalMinutes: Math.round(
          daySessions.reduce((sum, s) => sum + s.duration, 0) / 60
        ),
        completed: daySessions.length > 0,
      });
    }
    return result;
  }, [sessions]);

  const getTotalSessions = useCallback(() => {
    return sessions.filter((s) => s.completedAt).length;
  }, [sessions]);

  return { sessions, addSession, getStreak, getTotalMinutes, getWeeklyProgress, getTotalSessions };
}
