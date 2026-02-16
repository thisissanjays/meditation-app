import { useState, useEffect } from 'react';
import type { Meditation } from '../types';

// Demo meditation data for MVP — replace with Firestore queries
const DEMO_MEDITATIONS: Meditation[] = [
  {
    id: '1',
    title: 'Morning Calm',
    description: 'Start your day with a peaceful guided breathing session.',
    category: 'Mindfulness',
    duration: 600,
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    isPremium: false,
    media: {
      type: 'guided-text',
      backgroundImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      textSteps: [
        { timestamp: 0, instruction: 'Find a comfortable seated position and close your eyes.', duration: 30 },
        { timestamp: 30, instruction: 'Take a deep breath in through your nose for 4 counts.', duration: 20 },
        { timestamp: 50, instruction: 'Hold your breath gently for 4 counts.', duration: 20 },
        { timestamp: 70, instruction: 'Slowly exhale through your mouth for 6 counts.', duration: 20 },
        { timestamp: 90, instruction: 'Continue this breathing pattern. Let each breath bring calm.', duration: 60 },
        { timestamp: 150, instruction: 'Notice any tension in your body. Breathe into those areas.', duration: 60 },
        { timestamp: 210, instruction: 'Let your thoughts pass like clouds. Return focus to your breath.', duration: 60 },
        { timestamp: 270, instruction: 'Feel gratitude for this moment of stillness.', duration: 60 },
        { timestamp: 330, instruction: 'Slowly deepen your breath. Begin to return awareness to the room.', duration: 30 },
        { timestamp: 360, instruction: 'When you are ready, gently open your eyes.', duration: 20 },
      ],
    },
    instructor: 'Maya Chen',
    tags: ['morning', 'breathing', 'beginner'],
  },
  {
    id: '2',
    title: 'Deep Sleep Journey',
    description: 'A gentle body scan to guide you into restful sleep.',
    category: 'Sleep',
    duration: 900,
    thumbnail: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=400',
    isPremium: false,
    media: {
      type: 'guided-text',
      backgroundImage: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=800',
      textSteps: [
        { timestamp: 0, instruction: 'Lie down comfortably. Let your body sink into the surface beneath you.', duration: 30 },
        { timestamp: 30, instruction: 'Close your eyes. Take three slow, deep breaths.', duration: 30 },
        { timestamp: 60, instruction: 'Bring attention to the top of your head. Release any tension.', duration: 45 },
        { timestamp: 105, instruction: 'Move awareness to your face. Soften your forehead, jaw, and eyes.', duration: 45 },
        { timestamp: 150, instruction: 'Feel your shoulders melt into relaxation.', duration: 45 },
        { timestamp: 195, instruction: 'Let warmth flow down through your arms to your fingertips.', duration: 45 },
        { timestamp: 240, instruction: 'Release tension from your chest and abdomen with each exhale.', duration: 60 },
        { timestamp: 300, instruction: 'Feel heaviness in your legs. Let them completely relax.', duration: 60 },
        { timestamp: 360, instruction: 'Your entire body is at peace. Float in this stillness.', duration: 60 },
        { timestamp: 420, instruction: 'Allow sleep to gently wash over you...', duration: 60 },
      ],
    },
    instructor: 'James Park',
    tags: ['sleep', 'body-scan', 'evening'],
  },
  {
    id: '3',
    title: 'Focus Flow',
    description: 'Sharpen your concentration with this mindful attention exercise.',
    category: 'Focus',
    duration: 480,
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
    isPremium: false,
    media: {
      type: 'guided-text',
      backgroundImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
      textSteps: [
        { timestamp: 0, instruction: 'Sit upright with your spine straight but relaxed.', duration: 20 },
        { timestamp: 20, instruction: 'Focus your gaze softly on a point ahead, then close your eyes.', duration: 20 },
        { timestamp: 40, instruction: 'Bring your full attention to the sensation of breathing at your nostrils.', duration: 40 },
        { timestamp: 80, instruction: 'When your mind wanders, gently guide it back. No judgment.', duration: 60 },
        { timestamp: 140, instruction: 'Narrow your focus to just the tip of your nose. Feel the air flow.', duration: 60 },
        { timestamp: 200, instruction: 'Expand awareness to include sounds around you, while staying centered.', duration: 60 },
        { timestamp: 260, instruction: 'Return to single-pointed focus on your breath.', duration: 60 },
        { timestamp: 320, instruction: 'Carry this clarity with you. Slowly open your eyes.', duration: 30 },
      ],
    },
    instructor: 'Maya Chen',
    tags: ['focus', 'concentration', 'intermediate'],
  },
  {
    id: '4',
    title: 'Anxiety Relief',
    description: 'Calm racing thoughts with grounding and breath awareness.',
    category: 'Anxiety',
    duration: 720,
    thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400',
    isPremium: true,
    media: {
      type: 'guided-text',
      backgroundImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800',
      textSteps: [
        { timestamp: 0, instruction: 'Place both feet flat on the ground. Feel the support beneath you.', duration: 30 },
        { timestamp: 30, instruction: 'Name 5 things you can see, even with eyes closed — picture them.', duration: 45 },
        { timestamp: 75, instruction: 'Name 4 things you can feel. The chair, the air, your clothes.', duration: 45 },
        { timestamp: 120, instruction: 'Name 3 things you can hear right now.', duration: 30 },
        { timestamp: 150, instruction: 'Take a long, slow breath. You are safe in this moment.', duration: 45 },
        { timestamp: 195, instruction: 'Place a hand on your heart. Feel its steady rhythm.', duration: 60 },
        { timestamp: 255, instruction: 'Breathe in calm, breathe out worry. Repeat.', duration: 60 },
        { timestamp: 315, instruction: 'You are grounded. You are present. You are okay.', duration: 45 },
      ],
    },
    instructor: 'Dr. Sarah Kim',
    tags: ['anxiety', 'grounding', 'emergency'],
  },
  {
    id: '5',
    title: 'Self-Compassion Practice',
    description: 'Cultivate kindness toward yourself with loving-kindness meditation.',
    category: 'Self-Compassion',
    duration: 600,
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    isPremium: true,
    media: {
      type: 'guided-text',
      backgroundImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      textSteps: [
        { timestamp: 0, instruction: 'Sit comfortably. Place both hands over your heart.', duration: 30 },
        { timestamp: 30, instruction: 'Silently say: "May I be happy. May I be healthy. May I be at peace."', duration: 45 },
        { timestamp: 75, instruction: 'Think of someone you love. Send them the same wishes.', duration: 45 },
        { timestamp: 120, instruction: 'Extend this warmth to someone neutral — a stranger you passed today.', duration: 45 },
        { timestamp: 165, instruction: 'Now, courageously, send compassion to someone difficult in your life.', duration: 45 },
        { timestamp: 210, instruction: 'Finally, expand this love to all beings everywhere.', duration: 60 },
        { timestamp: 270, instruction: 'Return to yourself. You deserve this kindness too.', duration: 45 },
        { timestamp: 315, instruction: 'Sit with this warmth. Let it fill you completely.', duration: 45 },
      ],
    },
    instructor: 'Dr. Sarah Kim',
    tags: ['self-compassion', 'loving-kindness', 'emotional'],
  },
  {
    id: '6',
    title: 'Walking Meditation',
    description: 'A mindful walking practice you can do anywhere.',
    category: 'Mindfulness',
    duration: 600,
    thumbnail: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
    isPremium: false,
    media: {
      type: 'guided-text',
      backgroundImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      textSteps: [
        { timestamp: 0, instruction: 'Stand still for a moment. Feel your feet connecting to the earth.', duration: 30 },
        { timestamp: 30, instruction: 'Begin walking slowly. Feel each heel touch, then roll to toes.', duration: 60 },
        { timestamp: 90, instruction: 'Synchronize your breath with your steps. Inhale for 3 steps, exhale for 3.', duration: 60 },
        { timestamp: 150, instruction: 'Notice the world around you as if seeing it for the first time.', duration: 60 },
        { timestamp: 210, instruction: 'Feel the air on your skin. The ground beneath each step.', duration: 60 },
        { timestamp: 270, instruction: 'Walk with gratitude. Each step is a gift.', duration: 60 },
        { timestamp: 330, instruction: 'Gradually slow to a stop. Stand still. Breathe.', duration: 30 },
      ],
    },
    instructor: 'James Park',
    tags: ['walking', 'mindfulness', 'outdoor', 'beginner'],
  },
];

export function useMeditations() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch — swap with Firestore in production
    const timer = setTimeout(() => {
      setMeditations(DEMO_MEDITATIONS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getByCategory = (category: string) =>
    meditations.filter((m) => m.category === category);

  const getById = (id: string) => meditations.find((m) => m.id === id);

  const getFree = () => meditations.filter((m) => !m.isPremium);

  const getRecommended = (categories: string[]) =>
    meditations.filter(
      (m) => categories.includes(m.category) || m.tags.some((t) => categories.includes(t))
    );

  return { meditations, loading, getByCategory, getById, getFree, getRecommended };
}
