import { useState, useCallback } from 'react';
import type { CommunityPost } from '../types';

const DEMO_POSTS: CommunityPost[] = [
  {
    id: '1',
    userId: 'demo-1',
    userName: 'Sarah M.',
    content: 'Just completed my 30-day streak! The morning calm sessions have completely changed how I start my day.',
    type: 'milestone',
    likes: 24,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    userId: 'demo-2',
    userName: 'Alex T.',
    content: 'Tip: try the walking meditation during your lunch break. It really helps reset your mind for the afternoon.',
    type: 'tip',
    likes: 18,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    userId: 'demo-3',
    userName: 'Jordan L.',
    content: 'The anxiety relief session helped me through a tough meeting today. Grateful for this community.',
    type: 'reflection',
    likes: 31,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '4',
    userId: 'demo-4',
    userName: 'Priya K.',
    content: 'Hit 100 total minutes of meditation this week! Small steps add up.',
    type: 'milestone',
    likes: 42,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: '5',
    userId: 'demo-5',
    userName: 'Marcus W.',
    content: 'New to meditation — the beginner sessions here are so approachable. Day 3 done!',
    type: 'reflection',
    likes: 15,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export function useCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>(DEMO_POSTS);

  const addPost = useCallback(
    (post: Omit<CommunityPost, 'id' | 'likes' | 'createdAt'>) => {
      const newPost: CommunityPost = {
        ...post,
        id: crypto.randomUUID(),
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    []
  );

  const likePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  }, []);

  return { posts, addPost, likePost };
}
