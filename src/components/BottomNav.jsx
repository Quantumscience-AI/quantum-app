import React from 'react';
import { Home, Search, Code, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'discover', label: 'Discover', icon: Search, path: '/discover' },
    { id: 'lab', label: 'Lab', icon: Code, path: '/lab' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
