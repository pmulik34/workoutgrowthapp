import React from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onNext }) => {
  return (
    <div className="splash-screen">
      <div className="background-image">
        <img 
          src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*1TcmtjXGl2vE17Mz-JV-ZQ.jpeg" 
          alt="Anime workout motivation" 
          className="workout-bg-image"
        />
      </div>
      
      {/* Anime Particles */}
      <div className="particles-container">
        <div className="particle" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ top: '60%', left: '80%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ top: '40%', left: '70%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ top: '80%', left: '20%', animationDelay: '0.5s' }}></div>
        <div className="particle" style={{ top: '30%', left: '90%', animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="splash-content">
        <div className="hero-section">
          <div className="anime-title-container">
            <h1 className="hero-title">
              <span className="anime-text-glow">Unlock Your</span><br />
              <span className="highlight anime-power">Inner Power</span><br />
              <span className="anime-text-glow">⚡🔥💪</span>
            </h1>
            <div className="anime-quote">
              <p>"Plus Ultra! Go beyond your limits!"</p>
              <span className="quote-author">- All Might</span>
            </div>
          </div>
        </div>
        
        <div className="action-section">
          <button className="get-started-btn anime-btn glow-effect" onClick={onNext}>
            <span className="btn-text">BEGIN YOUR JOURNEY</span>
            <span className="btn-icon">⚡</span>
          </button>
          <div className="power-level-indicator">
            <span className="power-text">POWER LEVEL: INFINITE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 