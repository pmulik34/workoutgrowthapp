import React from 'react';
import './ProfilePage.css';

const ProfilePage = ({ userData }) => {
  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `Hero Profile: ${firstName} ⚔️`;
    }
    return 'Hero Profile: Warrior ⚔️';
  };

  // Calculate user stats
  const getUserStats = () => {
    return {
      currentStreak: userData?.currentStreak || 0,
      totalWorkouts: userData?.totalWorkouts || 0,
      thisWeekCompleted: 4,
      thisWeekTotal: 7,
      totalCaloriesBurned: 12500,
      totalTimeSpent: 1800, // in minutes
      averageWorkoutDuration: 40,
      favoriteWorkoutType: 'Dragon Training'
    };
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const stats = getUserStats();

  // Check if user has completed profile
  const hasProfile = userData && userData.name && userData.name.trim();

  return (
    <div className="profile-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Your legendary journey and achievements!</p>
        <div className="anime-quote">
          <p>"The greatest glory in living lies not in never falling, but in rising every time we fall."</p>
          <span className="quote-author">- Nelson Mandela</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            {hasProfile ? (
              <>
                <h2>{userData.name}</h2>
                <p className="profile-subtitle">Legendary Warrior</p>
                {userData.age && <p className="profile-detail">Age: {userData.age} years</p>}
                {userData.phone && <p className="profile-detail">Contact: {userData.phone}</p>}
                {userData.height && <p className="profile-detail">Height: {userData.height} cm</p>}
                {userData.weight && <p className="profile-detail">Weight: {userData.weight} kg</p>}
              </>
            ) : (
              <>
                <h2>Anonymous Warrior</h2>
                <p className="profile-subtitle">Complete your profile to unlock your full potential!</p>
                <p className="profile-detail">Tap "Edit Profile" to begin your legend</p>
              </>
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="edit-profile-btn anime-btn glow-effect">
            <span className="btn-text">EDIT PROFILE</span>
            <span className="btn-icon">⚡</span>
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="hero-stats">
        <h2>Your Battle Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-label">Battle Streak</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚔️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalWorkouts}</div>
              <div className="stat-label">Missions Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{formatTime(stats.totalTimeSpent)}</div>
              <div className="stat-label">Total Training Time</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalCaloriesBurned.toLocaleString()}</div>
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
            <span className="progress-text">{stats.thisWeekCompleted}/{stats.thisWeekTotal} completed</span>
            <span className="progress-percentage">{Math.round((stats.thisWeekCompleted / stats.thisWeekTotal) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(stats.thisWeekCompleted / stats.thisWeekTotal) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Hero Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement-card unlocked">
            <div className="achievement-icon">🎯</div>
            <div className="achievement-content">
              <h3>First Steps</h3>
              <p>Complete your first workout</p>
              <span className="unlock-date">Unlocked: 2024-01-15</span>
            </div>
          </div>
          <div className="achievement-card unlocked">
            <div className="achievement-icon">🔥</div>
            <div className="achievement-content">
              <h3>Week Warrior</h3>
              <p>Complete 7 workouts in a week</p>
              <span className="unlock-date">Unlocked: 2024-01-22</span>
            </div>
          </div>
          <div className="achievement-card unlocked">
            <div className="achievement-icon">👑</div>
            <div className="achievement-content">
              <h3>Consistency King</h3>
              <p>Maintain a 30-day streak</p>
              <span className="unlock-date">Unlocked: 2024-02-10</span>
            </div>
          </div>
          <div className="achievement-card locked">
            <div className="achievement-icon">💪</div>
            <div className="achievement-content">
              <h3>Strength Master</h3>
              <p>Complete 50 strength workouts</p>
              <div className="progress-indicator">
                <span className="progress-text">35%</span>
                <div className="mini-progress-bar">
                  <div className="mini-progress-fill" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings & Actions */}
      <div className="settings-section">
        <h2>Hero Settings</h2>
        <div className="settings-grid">
          <button className="setting-card">
            <div className="setting-icon">🎨</div>
            <div className="setting-content">
              <h3>Customize Theme</h3>
              <p>Change your app appearance</p>
            </div>
          </button>
          <button className="setting-card">
            <div className="setting-icon">🔔</div>
            <div className="setting-content">
              <h3>Notifications</h3>
              <p>Manage your alerts</p>
            </div>
          </button>
          <button className="setting-card">
            <div className="setting-icon">📊</div>
            <div className="setting-content">
              <h3>Export Data</h3>
              <p>Download your progress</p>
            </div>
          </button>
          <button className="setting-card">
            <div className="setting-icon">❓</div>
            <div className="setting-content">
              <h3>Help & Support</h3>
              <p>Get assistance</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 