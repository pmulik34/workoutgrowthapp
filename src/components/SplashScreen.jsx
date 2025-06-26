import React from 'react';
import './SplashScreen.css';
import gokuImage from '../assets/goku-ui.png';
// import gokuImage from '../assets/goku-superSaiyan.png';


const SplashScreen = ({ onNext }) => {
  return (
    <div className="splash-screen">
      <div className="background-image">
        <img 
          src={gokuImage}
          alt="Goku UI" 
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
              <span className="highlight anime-power">Super Saiyan</span><br />
              <span className="anime-text-glow">⚡🔥💪</span>
            </h1>
            <div className="anime-quote">
              <p>"Power comes in response to a need, not a desire!"</p>
            </div>
          </div>
        </div>
        
        <div className="action-section">
          <button className="get-started-btn anime-btn glow-effect" onClick={onNext}>
            <span className="btn-text">BEGIN YOUR TRAINING</span>
            <span className="btn-icon">⚡</span>
          </button>
          <div className="power-level-indicator">
            <span className="power-text">POWER LEVEL: OVER 9000!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 