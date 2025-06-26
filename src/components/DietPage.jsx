import React from 'react';
import './DietPage.css';

const DietPage = ({ userData }) => {
  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `GlowUp, ${firstName}! ✨`;
    }
    return 'GlowUp, Warrior! ✨';
  };

  // Get user stats (mock data for now)
  const getUserStats = () => {
    return {
      dailyCalories: userData?.dailyCalories || 2000,
      proteinGoal: userData?.proteinGoal || 150,
      carbsGoal: userData?.carbsGoal || 200,
      fatGoal: userData?.fatGoal || 65
    };
  };

  const stats = getUserStats();

  return (
    <div className="diet-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Fuel your body with the power of champions!</p>
        <div className="anime-quote">
          <p>"Your body is a temple. Treat it like one."</p>
          <span className="quote-author">- Ancient Warrior Wisdom</span>
        </div>
      </div>

      {/* Nutrition Stats */}
      <div className="nutrition-stats">
        <h2>Today's Power Goals</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.dailyCalories}</div>
              <div className="stat-label">Calories</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-value">{stats.proteinGoal}g</div>
              <div className="stat-label">Protein</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{stats.carbsGoal}g</div>
              <div className="stat-label">Carbs</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.fatGoal}g</div>
              <div className="stat-label">Healthy Fats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Reminder */}
      <div className="hydration-section">
        <div className="hydration-card">
          <div className="hydration-icon">💧</div>
          <div className="hydration-content">
            <h3>Stay Hydrated, Warrior!</h3>
            <p>Drink 8-10 glasses of water daily to maintain peak performance</p>
            <div className="water-tracker">
              <div className="water-glasses">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="water-glass">
                    <span className="glass-icon">🥤</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPage; 