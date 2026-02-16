import { Outlet, NavLink } from 'react-router-dom';
import { Home, Play, BarChart3, Users, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Play, label: 'Explore' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <nav className="bottom-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
