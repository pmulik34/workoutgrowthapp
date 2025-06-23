import React from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onNext }) => {
  return (
    <div className="splash-screen">
      <div className="background-image">
        <img 
          src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*1TcmtjXGl2vE17Mz-JV-ZQ.jpeg" 
          alt="Workout motivation" 
          className="workout-bg-image"
        />
      </div>
      
      <div className="splash-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Push Yourself<br />
            Harder to 🏋️🔥💪<br />
            Become <span className="highlight">Better</span>
          </h1>
        </div>
        
        <div className="action-section">
          <button className="get-started-btn" onClick={onNext}>
            <span className="btn-text">Get Started</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 