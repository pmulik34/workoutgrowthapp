import React from 'react';
import './HomeScreen.css';

const HomeScreen = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'workout':
        return (
          <div className="tab-content">
            <h1>Workout</h1>
            <p>Your workout routines will appear here</p>
          </div>
        );
      case 'diet':
        return (
          <div className="tab-content">
            <h1>Diet</h1>
            <p>Your diet plans will appear here</p>
          </div>
        );
      case 'progress':
        return (
          <div className="tab-content">
            <h1>Progress</h1>
            <p>Your progress tracking will appear here</p>
          </div>
        );
      case 'profile':
        return (
          <div className="tab-content">
            <h1>Profile</h1>
            <p>Your profile settings will appear here</p>
          </div>
        );
      default:
        return (
          <div className="tab-content">
            <h1>Welcome to Workout Growth</h1>
            <p>Select a tab to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="home-screen">
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default HomeScreen; 