import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

// Import new anime-themed navigation images
import homeIcon from '../assets/Home.png';
import workoutIcon from '../assets/workoutIcon.png';
import glowUpIcon from '../assets/glowUp.png';
import progressIcon from '../assets/Progress.png';
import profileIcon from '../assets/Profile.png';

const isEmoji = (icon) => {
  // If it's a single Unicode character or a short string, treat as emoji
  return typeof icon === 'string' && icon.length <= 3 && !icon.endsWith('.png') && !icon.endsWith('.jpg') && !icon.endsWith('.svg');
};

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: homeIcon,
      path: '/'
    },
    {
      id: 'workout',
      label: 'Workout',
      icon: workoutIcon,
      path: '/workout'
    },
    {
      id: 'diet',
      label: 'GlowUp',
      icon: glowUpIcon,
      path: '/diet'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: progressIcon,
      path: '/progress'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: profileIcon,
      path: '/profile'
    }
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath === '/' || currentPath === '/home') return 'home';
    if (currentPath.startsWith('/workout')) return 'workout';
    if (currentPath.startsWith('/diet')) return 'diet';
    if (currentPath.startsWith('/progress')) return 'progress';
    if (currentPath.startsWith('/profile')) return 'profile';
    return 'home'; // Default to home
  };

  const activeTab = getActiveTab();

  const handleTabClick = (path) => {
    console.log('BottomNavigation - handleTabClick called with path:', path);
    console.log('BottomNavigation - Current location:', location.pathname);
    navigate(path);
  };

  return (
    <div className="bottom-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.path)}
        >
          <div className="nav-icon">
            {isEmoji(tab.icon) ? (
              <span className="nav-icon-emoji">{tab.icon}</span>
            ) : (
              <img 
                src={tab.icon} 
                alt={tab.label} 
                className="nav-icon-img"
              />
            )}
          </div>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation; 