import { useState } from 'react';
import { Heart, MessageCircle, Award, Lightbulb, PenLine } from 'lucide-react';
import { useCommunity } from '../hooks/useCommunity';
import type { CommunityPost } from '../types';

export default function CommunityPage() {
  const { posts, addPost, likePost } = useCommunity();
  const [showCompose, setShowCompose] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<CommunityPost['type']>('reflection');

  const handlePost = () => {
    if (!newContent.trim()) return;
    addPost({
      userId: 'local-user',
      userName: 'You',
      content: newContent.trim(),
      type: newType,
    });
    setNewContent('');
    setShowCompose(false);
  };

  const typeIcon = (type: CommunityPost['type']) => {
    switch (type) {
      case 'milestone': return <Award size={14} className="post-type-icon milestone" />;
      case 'tip': return <Lightbulb size={14} className="post-type-icon tip" />;
      default: return <MessageCircle size={14} className="post-type-icon reflection" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="page community-page">
      <header className="page-header">
        <h1>Community</h1>
        <button className="btn-icon" onClick={() => setShowCompose(!showCompose)}>
          <PenLine size={20} />
        </button>
      </header>

      {showCompose && (
        <div className="compose-card">
          <div className="compose-type-picker">
            {(['reflection', 'milestone', 'tip'] as const).map((t) => (
              <button
                key={t}
                className={`type-btn ${newType === t ? 'active' : ''}`}
                onClick={() => setNewType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your thoughts with the community..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
          />
          <button className="btn-primary" onClick={handlePost} disabled={!newContent.trim()}>
            Post
          </button>
        </div>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">
                {post.userName.charAt(0)}
              </div>
              <div className="post-meta">
                <span className="post-author">{post.userName}</span>
                <span className="post-time">{timeAgo(post.createdAt)}</span>
              </div>
              {typeIcon(post.type)}
            </div>
            <p className="post-content">{post.content}</p>
            <button className="like-btn" onClick={() => likePost(post.id)}>
              <Heart size={16} /> {post.likes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
