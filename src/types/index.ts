export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPremium: boolean;
  preferences: UserPreferences;
  streak: number;
  totalMinutes: number;
  joinedAt: string;
}

export interface UserPreferences {
  goals: MeditationGoal[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredDuration: number; // minutes
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'anytime';
  favoriteCategories: string[];
}

export type MeditationGoal =
  | 'stress'
  | 'sleep'
  | 'focus'
  | 'anxiety'
  | 'self-compassion'
  | 'mindfulness';

export interface Meditation {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // seconds
  thumbnail: string;
  isPremium: boolean;
  media: MeditationMedia;
  instructor: string;
  tags: string[];
}

export interface MeditationMedia {
  type: 'audio' | 'video' | 'guided-text';
  audioUrl?: string;
  videoUrl?: string;
  textSteps?: GuidedStep[];
  backgroundImage?: string;
}

export interface GuidedStep {
  timestamp: number; // seconds
  instruction: string;
  duration: number;
}

export interface Session {
  id: string;
  meditationId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  duration: number; // actual seconds
  mood?: 'great' | 'good' | 'okay' | 'low';
  notes?: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  type: 'reflection' | 'milestone' | 'tip';
  likes: number;
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  sessions: number;
  totalMinutes: number;
  completed: boolean;
}
