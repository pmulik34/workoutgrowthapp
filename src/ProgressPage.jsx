import React, { useState, useEffect } from 'react';
import './ProgressPage.css';

const ProgressPage = ({ userData }) => {
  const [progressData, setProgressData] = useState({
    currentStreak: 0,
    totalWorkouts: 0,
    thisWeekCompleted: 0,
    thisWeekTotal: 7,
    stats: {
      totalCaloriesBurned: 0,
      totalTimeSpent: 0,
      averageWorkoutDuration: 0,
      favoriteWorkoutType: 'None'
    }
  });

  // Load progress data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('workoutAppData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.progress) {
        setProgressData(parsedData.progress);
      }
    }
  }, []);

  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `Progress Report: ${firstName} 📊`;
    }
    return 'Progress Report: Warrior 📊';
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressPercentage = (completed, goal) => {
    return Math.min((completed / goal) * 100, 100);
  };

  return (
    <div className="progress-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Track your epic transformation and celebrate your victories!</p>
        <div className="anime-quote">
          <p>"The journey of a thousand miles begins with a single step."</p>
          <span className="quote-author">- Lao Tzu</span>
        </div>
      </div>

      {/* Current Stats */}
      <div className="current-stats">
        <h2>Your Power Level</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{progressData.currentStreak}</div>
              <div className="stat-label">Battle Streak</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚔️</div>
            <div className="stat-content">
              <div className="stat-value">{progressData.totalWorkouts}</div>
              <div className="stat-label">Missions Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{formatTime(progressData.stats.totalTimeSpent)}</div>
              <div className="stat-label">Total Training Time</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-value">{progressData.stats.totalCaloriesBurned.toLocaleString()}</div>
              <div className="stat-label">Calories Burned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="weekly-progress">
        <h2>This Week's Battle</h2>
        <div className="progress-overview">
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage(progressData.thisWeekCompleted, progressData.thisWeekTotal)}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {progressData.thisWeekCompleted} of {progressData.thisWeekTotal} days completed
            </div>
          </div>
          <div className="progress-percentage">
            {Math.round(getProgressPercentage(progressData.thisWeekCompleted, progressData.thisWeekTotal))}%
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="achievement-stats">
        <h2>Legendary Achievements</h2>
        <div className="achievement-grid">
          <div className="achievement-card">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-content">
              <h3>Average Workout Duration</h3>
              <p>{progressData.stats.averageWorkoutDuration} minutes</p>
            </div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">⚔️</div>
            <div className="achievement-content">
              <h3>Favorite Training Type</h3>
              <p>{progressData.stats.favoriteWorkoutType}</p>
            </div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">🔥</div>
            <div className="achievement-content">
              <h3>Current Streak</h3>
              <p>{progressData.currentStreak} days</p>
            </div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">📈</div>
            <div className="achievement-content">
              <h3>Total Missions</h3>
              <p>{progressData.totalWorkouts} completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="motivation-section">
        <h2>Keep the Fire Burning! 🔥</h2>
        <div className="motivation-content">
          <p>Every workout brings you closer to your ultimate form. Stay consistent, stay strong!</p>
          <div className="motivation-stats">
            <div className="motivation-stat">
              <span className="stat-number">{progressData.currentStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="motivation-stat">
              <span className="stat-number">{progressData.totalWorkouts}</span>
              <span className="stat-label">Total Workouts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 