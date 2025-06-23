import React from 'react';
import './BottomNavigation.css';

// Import images
import workoutIcon from '../assets/muscle.png';
import dietIcon from '../assets/healthy-food.png';
import progressIcon from '../assets/report.png';
import profileIcon from '../assets/user.png';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'workout',
      label: 'Workout',
      icon: workoutIcon
    },
    {
      id: 'diet',
      label: 'Diet',
      icon: dietIcon
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: progressIcon
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: profileIcon
    }
  ];

  return (
    <div className="bottom-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
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