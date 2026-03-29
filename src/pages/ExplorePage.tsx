import { useState } from 'react';
import { Search } from 'lucide-react';
import { useMeditations } from '../hooks/useMeditations';
import MeditationCard from '../components/MeditationCard';

const CATEGORIES = ['All', 'Mindfulness', 'Sleep', 'Focus', 'Anxiety', 'Self-Compassion'];

export default function ExplorePage() {
  const { meditations, loading } = useMeditations();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = meditations.filter((m) => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="page loading">Loading...</div>;

  return (
    <div className="page explore-page">
      <header className="page-header">
        <h1>Explore</h1>
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search meditations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="meditation-grid">
        {filtered.map((m) => (
          <MeditationCard key={m.id} meditation={m} />
        ))}
        {filtered.length === 0 && (
          <p className="empty-state">No meditations found. Try another search.</p>
        )}
      </div>
    </div>
  );
}
