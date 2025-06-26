import React, { useState, useEffect } from 'react';
import { useProgress } from './ProgressContext';
import { workoutData } from '../WorkoutData.js';
import './ProfilePage.css';

const ProfilePage = ({ userData, onUpdateUser }) => {
  const { progress, clearAllData } = useProgress();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    age: '',
    phone: '',
    height: '',
    weight: ''
  });
  const [errors, setErrors] = useState({});

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

  // Calculate total calories burned from completed exercises
  const calculateTotalCaloriesBurned = () => {
    let totalCalories = 0;
    
    // Loop through all dates in progress
    Object.keys(progress.byDate).forEach(dateKey => {
      const dayData = progress.byDate[dateKey];
      const completedExercises = dayData?.exercises || {};
      
      // Get the day of the week for this date
      const date = new Date(dateKey);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Get workout data for this day
      const workoutDayData = workoutData[dayName];
      const warmupData = workoutData.Warmup;
      
      if (workoutDayData && workoutDayData.exercises) {
        // Check warmup exercises
        warmupData.exercises.forEach((exercise, index) => {
          const exerciseId = `warmup_${index}`;
          if (completedExercises[exerciseId]) {
            totalCalories += exercise.caloriesBurn || 0;
          }
        });
        
        // Check main workout exercises
        workoutDayData.exercises.forEach((exercise, index) => {
          const exerciseId = `main_${index}`;
          if (completedExercises[exerciseId]) {
            totalCalories += exercise.caloriesBurn || 0;
          }
        });
      }
    });
    
    return totalCalories;
  };

  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `Warrior Profile: ${firstName} ⚔️`;
    }
    return 'Warrior Profile: Warrior ⚔️';
  };

  // Calculate user stats using ProgressContext
  const calculateUserStats = () => {
    const totalCaloriesBurned = calculateTotalCaloriesBurned();
    
    // Calculate total workouts completed
    let totalWorkouts = 0;
    Object.keys(progress.byDate).forEach(dateKey => {
      const dayData = progress.byDate[dateKey];
      if (dayData?.status === 'done') {
        totalWorkouts++;
      }
    });
    
    // Calculate current streak
    const currentStreak = progress.streaks?.current || 0;
    
    // Calculate this week's progress - ONLY for today's current workout
    let thisWeekCompleted = 0;
    let thisWeekTotal = 0;
    
    // Get today's progress only
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const todayData = progress.byDate[todayKey];
    
    if (todayData) {
      thisWeekTotal = todayData.total || 0;
      thisWeekCompleted = todayData.completed || 0;
    }
    
    return {
      totalCaloriesBurned,
      totalWorkouts,
      currentStreak,
      thisWeekCompleted,
      thisWeekTotal
    };
  };

  const stats = calculateUserStats();

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
      // Update localStorage
      const savedData = localStorage.getItem('workoutAppData');
      let appData = savedData ? JSON.parse(savedData) : {};
      
      // Update user data
      appData.user = {
        ...appData.user,
        ...editForm
      };
      
      // Save back to localStorage
      localStorage.setItem('workoutAppData', JSON.stringify(appData));
      
      // Call parent update function if provided
      if (onUpdateUser) {
        onUpdateUser(editForm);
      }
      
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

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚔️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisWeekCompleted}/{stats.thisWeekTotal}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCaloriesBurned}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="weekly-progress">
        <h2>This Week's Quest</h2>
        <div className="progress-bar-container">
          <div className="progress-info">
            <span className="progress-text">{stats.thisWeekCompleted}/{stats.thisWeekTotal} completed</span>
            <span className="progress-percentage">{stats.thisWeekTotal > 0 ? Math.round((stats.thisWeekCompleted / stats.thisWeekTotal) * 100) : 0}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.thisWeekTotal > 0 ? (stats.thisWeekCompleted / stats.thisWeekTotal) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>


      {/* Achievements */}
      <div className="achievements-section">
        <h2>Warrior Achievements</h2>
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

      {/* Temporary Splash Screen Test Button */}
      {/* <div className="test-section" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>🧪 Test Features</h3>
        <button 
          className="anime-btn glow-effect" 
          onClick={() => {
            localStorage.removeItem('hasCompletedSplash');
            window.location.reload();
          }}
          style={{ 
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            maxWidth: '300px',
            fontSize: '1rem',
            padding: '1rem 2rem'
          }}
        >
          <span className="btn-text">Test Splash Screen</span>
          <span className="btn-icon">🎬</span>
        </button>
        <p style={{ fontSize: '0.9rem', color: '#b8d6c5', marginTop: '0.5rem' }}>
          Click to test the new Goku Super Saiyan splash screen
        </p>
      </div> */}
    </div>
  );
};

export default ProfilePage; 