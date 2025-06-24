import React from 'react';
import './ProgressPage.css';

const ProgressPage = ({ userData }) => {
  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `Your Journey, ${firstName}! 📊`;
    }
    return 'Your Journey, Warrior! 📊';
  };

  // Mock progress data (in a real app, this would come from user's actual data)
  const progressData = {
    currentStreak: userData?.currentStreak || 7,
    totalWorkouts: userData?.totalWorkouts || 45,
    weeklyGoal: 5,
    weeklyCompleted: 4,
    monthlyGoal: 20,
    monthlyCompleted: 18,
    achievements: [
      { id: 1, name: 'First Steps', description: 'Complete your first workout', icon: '🎯', unlocked: true, date: '2024-01-15' },
      { id: 2, name: 'Week Warrior', description: 'Complete 7 workouts in a week', icon: '🔥', unlocked: true, date: '2024-01-22' },
      { id: 3, name: 'Consistency King', description: 'Maintain a 30-day streak', icon: '👑', unlocked: true, date: '2024-02-10' },
      { id: 4, name: 'Strength Master', description: 'Complete 50 strength workouts', icon: '💪', unlocked: false, progress: 35 },
      { id: 5, name: 'Endurance Legend', description: 'Complete 25 cardio sessions', icon: '⚡', unlocked: false, progress: 18 },
      { id: 6, name: 'Flexibility Guru', description: 'Complete 30 flexibility workouts', icon: '🧘', unlocked: false, progress: 12 }
    ],
    weeklyProgress: [
      { day: 'Mon', completed: true, type: 'Dragon Training' },
      { day: 'Tue', completed: true, type: 'Ninja Agility' },
      { day: 'Wed', completed: true, type: 'Core Mastery' },
      { day: 'Thu', completed: true, type: 'Spirit Flexibility' },
      { day: 'Fri', completed: false, type: 'Endurance Test' },
      { day: 'Sat', completed: false, type: 'Rest & Recovery' },
      { day: 'Sun', completed: false, type: 'Hero Strength' }
    ],
    stats: {
      totalCaloriesBurned: 12500,
      totalTimeSpent: 1800, // in minutes
      averageWorkoutDuration: 40,
      favoriteWorkoutType: 'Dragon Training'
    }
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
        <h2>This Week's Quest</h2>
        <div className="progress-bar-container">
          <div className="progress-info">
            <span className="progress-text">{progressData.weeklyCompleted}/{progressData.weeklyGoal} completed</span>
            <span className="progress-percentage">{getProgressPercentage(progressData.weeklyCompleted, progressData.weeklyGoal)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage(progressData.weeklyCompleted, progressData.weeklyGoal)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="weekly-calendar">
          {progressData.weeklyProgress.map((day, index) => (
            <div key={index} className={`day-item ${day.completed ? 'completed' : ''}`}>
              <div className="day-name">{day.day}</div>
              <div className="day-status">
                {day.completed ? (
                  <span className="status-icon">✅</span>
                ) : (
                  <span className="status-icon">⏳</span>
                )}
              </div>
              <div className="day-type">{day.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Hero Achievements</h2>
        <div className="achievements-grid">
          {progressData.achievements.map((achievement) => (
            <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {achievement.unlocked ? (
                  <span className="unlock-date">Unlocked: {achievement.date}</span>
                ) : (
                  <div className="progress-indicator">
                    <span className="progress-text">{achievement.progress}%</span>
                    <div className="mini-progress-bar">
                      <div 
                        className="mini-progress-fill" 
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Goal */}
      <div className="monthly-goal">
        <h2>Monthly Challenge</h2>
        <div className="goal-card">
          <div className="goal-header">
            <div className="goal-icon">🎯</div>
            <div className="goal-info">
              <h3>Complete {progressData.monthlyGoal} Workouts</h3>
              <p>Stay consistent and build your strength!</p>
            </div>
          </div>
          <div className="goal-progress">
            <div className="progress-info">
              <span className="progress-text">{progressData.monthlyCompleted}/{progressData.monthlyGoal}</span>
              <span className="progress-percentage">{getProgressPercentage(progressData.monthlyCompleted, progressData.monthlyGoal)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage(progressData.monthlyCompleted, progressData.monthlyGoal)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 