import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ userData, onUpdateUser }) => {
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

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    age: '',
    phone: '',
    height: '',
    weight: ''
  });
  const [errors, setErrors] = useState({});

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

  // Initialize edit form with current user data
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || '',
        age: userData.age || '',
        phone: userData.phone || '',
        height: userData.height || '',
        weight: userData.weight || ''
      });
    }
  }, [userData]);

  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `Warrior Profile: ${firstName} ⚔️`;
    }
    return 'Warrior Profile: Warrior ⚔️';
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Check if user has completed profile
  const hasProfile = userData && userData.name && userData.name.trim();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (editForm.age && (isNaN(editForm.age) || editForm.age < 1 || editForm.age > 120)) {
      newErrors.age = 'Please enter a valid age, young warrior!';
    }
    
    if (editForm.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(editForm.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid communication device number!';
    }
    
    if (editForm.height && (isNaN(editForm.height) || editForm.height < 50 || editForm.height > 300)) {
      newErrors.height = 'Enter a valid height, champion!';
    }
    
    if (editForm.weight && (isNaN(editForm.weight) || editForm.weight < 20 || editForm.weight > 300)) {
      newErrors.weight = 'Enter a valid weight, mighty one!';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save profile
  const handleSaveProfile = () => {
    if (validateForm()) {
      onUpdateUser(editForm);
      setIsEditing(false);
      setErrors({});
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditForm({
      name: userData?.name || '',
      age: userData?.age || '',
      phone: userData?.phone || '',
      height: userData?.height || '',
      weight: userData?.weight || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  // Handle start editing
  const handleStartEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="profile-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Your legendary journey and achievements!</p>
        <div className="anime-quote">
          <p>"The greatest glory in living lies not in never falling, but in rising every time we fall."</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            {isEditing ? (
              // Edit Form
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    <span className="label-icon">⚔️</span>
                    Warrior Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="form-input anime-input"
                    placeholder="Enter your legendary name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="age" className="form-label">
                    <span className="label-icon">🎂</span>
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={editForm.age}
                    onChange={handleInputChange}
                    className={`form-input anime-input ${errors.age ? 'error' : ''}`}
                    placeholder="Your age"
                    min="1"
                    max="120"
                  />
                  {errors.age && <span className="error-message">{errors.age}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    <span className="label-icon">📱</span>
                    Communication Device
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className={`form-input anime-input ${errors.phone ? 'error' : ''}`}
                    placeholder="Your contact number"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="height" className="form-label">
                      <span className="label-icon">📏</span>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={editForm.height}
                      onChange={handleInputChange}
                      className={`form-input anime-input ${errors.height ? 'error' : ''}`}
                      placeholder="Your stature"
                      min="50"
                      max="300"
                    />
                    {errors.height && <span className="error-message">{errors.height}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="weight" className="form-label">
                      <span className="label-icon">⚖️</span>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={editForm.weight}
                      onChange={handleInputChange}
                      className={`form-input anime-input ${errors.weight ? 'error' : ''}`}
                      placeholder="Your mass"
                      min="20"
                      max="300"
                    />
                    {errors.weight && <span className="error-message">{errors.weight}</span>}
                  </div>
                </div>
              </div>
            ) : (
              // Display Profile Info
              <>
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
              </>
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button className="save-btn anime-btn glow-effect" onClick={handleSaveProfile}>
                <span className="btn-text">SAVE PROFILE</span>
                <span className="btn-icon">💾</span>
              </button>
              <button className="cancel-btn anime-btn" onClick={handleCancelEdit}>
                <span className="btn-text">CANCEL</span>
                <span className="btn-icon">❌</span>
              </button>
            </div>
          ) : (
            <button className="edit-profile-btn anime-btn glow-effect" onClick={handleStartEdit}>
              <span className="btn-text">{hasProfile ? 'EDIT PROFILE' : 'CREATE PROFILE'}</span>
              <span className="btn-icon">⚡</span>
            </button>
          )}
        </div>
      </div>

      {/* Warrior Stats */}
      <div className="hero-stats">
        <h2>Your Battle Statistics</h2>
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
        <h2>This Week's Progress</h2>
        <div className="progress-overview">
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((progressData.thisWeekCompleted / progressData.thisWeekTotal) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {progressData.thisWeekCompleted} of {progressData.thisWeekTotal} days completed
            </div>
          </div>
          <div className="progress-percentage">
            {Math.round((progressData.thisWeekCompleted / progressData.thisWeekTotal) * 100)}%
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

      {/* Settings Section */}
      <div className="settings-section">
        <h2>Warrior Settings</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <div className="setting-icon">🔔</div>
            <div className="setting-content">
              <h3>Notifications</h3>
              <p>Stay motivated with daily reminders</p>
            </div>
            <div className="setting-toggle">
              <input type="checkbox" id="notifications" defaultChecked />
              <label htmlFor="notifications"></label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-icon">🌙</div>
            <div className="setting-content">
              <h3>Dark Mode</h3>
              <p>Perfect for night training sessions</p>
            </div>
            <div className="setting-toggle">
              <input type="checkbox" id="darkmode" defaultChecked />
              <label htmlFor="darkmode"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 