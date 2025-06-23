import React from 'react';
import './DietPage.css';

const DietPage = () => {
  return (
    <div className="diet-page">
      <div className="coming-soon-container">
        <div className="coming-soon-icon">
          🍽️
        </div>
        <h1 className="coming-soon-title">Diet Plans</h1>
        <h2 className="coming-soon-subtitle">Coming Soon</h2>
        <p className="coming-soon-description">
          We're preparing comprehensive diet plans and meal recommendations 
          to fuel your fitness journey and complement your workout routine.
        </p>
        <div className="coming-soon-features">
          <div className="feature-item">
            <span className="feature-icon">🥗</span>
            <span className="feature-text">Weekly Meal Plans</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🍳</span>
            <span className="feature-text">Healthy Recipe Collections</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💪</span>
            <span className="feature-text">Pre & Post Workout Meals</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Goal-Based Diet Plans</span>
          </div>
        </div>
        <div className="coming-soon-note">
          <p>Nutrition plans designed for your fitness goals!</p>
        </div>
      </div>
    </div>
  );
};

export default DietPage; 