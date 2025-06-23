import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

// Import images
import workoutIcon from '../assets/muscle.png';
import dietIcon from '../assets/healthy-food.png';
import progressIcon from '../assets/report.png';
import profileIcon from '../assets/user.png';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'workout',
      label: 'Workout',
      icon: workoutIcon,
      path: '/workout'
    },
    {
      id: 'diet',
      label: 'Diet',
      icon: dietIcon,
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
    if (currentPath.startsWith('/workout')) return 'workout';
    if (currentPath.startsWith('/diet')) return 'diet';
    if (currentPath.startsWith('/progress')) return 'progress';
    if (currentPath.startsWith('/profile')) return 'profile';
    return 'workout';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (path) => {
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
            <img 
              src={tab.icon} 
              alt={tab.label} 
              className="nav-icon-img"
            />
          </div>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation; 