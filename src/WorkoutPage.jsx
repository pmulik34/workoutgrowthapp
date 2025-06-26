import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkoutPage.css';
import { workoutData } from '../WorkoutData.js';

// Import workout images
import upperBodyImg from '../assets/goku-upperbody.png';
import lowerBodyImg from '../assets/vegata-back.png';
import coreWorkoutImg from '../assets/baki-core.png';
import flexibilityImg from '../assets/zoro.png';
import muscleImg from '../assets/muscle.png';
import luffyRestImg from '../assets/luffy-rest.png';
import shanksRestImg from '../assets/shanks-rest.png';
import erenFullbodyImg from '../assets/eren-fullbody.png';

const WorkoutPage = ({ userData }) => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState({
    currentStreak: 0,
    totalWorkouts: 0,
    thisWeekCompleted: 0,
    thisWeekTotal: 7
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

  // Get current day
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `Ready for battle, ${firstName}? ⚔️`;
    }
    return 'Ready for battle, Warrior? ⚔️';
  };

  // Get current day's exercises
  const todaysExercises = workoutData[currentDay]?.exercises || [];

  // Generate workout types from actual data (categorize exercises based on their names)
  const categorizeExercise = (exerciseName) => {
    const name = exerciseName.toLowerCase();
    if (name.includes('push') || name.includes('angel') || name.includes('burpee')) {
      return 'Upper Body';
    } else if (name.includes('squat') || name.includes('lunge') || name.includes('step') || name.includes('bridge')) {
      return 'Lower Body';
    } else if (name.includes('plank') || name.includes('crunch') || name.includes('tap')) {
      return 'Core';
    } else if (name.includes('stretch') || name.includes('pose') || name.includes('cobra') || name.includes('twist')) {
      return 'Flexibility';
    } else if (name.includes('rest')) {
      return 'Recovery';
    } else if (name.includes('hang') || name.includes('hold')) {
      return 'Endurance';
    } else {
      return 'Strength';
    }
  };

  const getWorkoutImage = (dayName) => {
    const dayData = workoutData[dayName];
    if (!dayData || !dayData.exercises || dayData.exercises.length === 0) {
      return dayName === 'Saturday' ? luffyRestImg : shanksRestImg;
    }
    
    const workoutType = categorizeExercise(dayData.exercises[0].name);
    
    switch (workoutType) {
      case 'Upper Body':
        return upperBodyImg;
      case 'Lower Body':
        return lowerBodyImg;
      case 'Core':
        return coreWorkoutImg;
      case 'Flexibility':
        return flexibilityImg;
      case 'Recovery':
        return dayName === 'Saturday' ? luffyRestImg : shanksRestImg;
      default:
        return erenFullbodyImg;
    }
  };

  const getWorkoutTitle = (dayName) => {
    if (workoutData[dayName]) {
      return workoutData[dayName].title;
    }
    return 'Rest Day';
  };

  const getExerciseCount = (dayName) => {
    if (workoutData[dayName] && workoutData[dayName].exercises) {
      return workoutData[dayName].exercises.length;
    }
    return 0;
  };

  // Handle navigation
  const handleNavigateTo = (path) => {
    navigate(path);
  };

  const handleDayClick = (dayName) => {
    navigate(`/workout/${dayName.toLowerCase()}`);
  };

  // Get workout days
  const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="workout-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Choose your training mission and unleash your potential!</p>
        <div className="anime-quote">
          <p>"The only bad workout is the one that didn't happen."</p>
          <span className="quote-author">- Unknown Warrior</span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <h2>Your Battle Progress</h2>
        <div className="progress-stats">
          <div className="progress-stat">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{progressData.currentStreak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          <div className="progress-stat">
            <div className="stat-icon">⚔️</div>
            <div className="stat-content">
              <div className="stat-value">{progressData.totalWorkouts}</div>
              <div className="stat-label">Total Workouts</div>
            </div>
          </div>
          <div className="progress-stat">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{progressData.thisWeekCompleted}/{progressData.thisWeekTotal}</div>
              <div className="stat-label">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Workout Schedule */}
      <div className="weekly-schedule">
        <h2>Weekly Training Schedule</h2>
        <div className="workout-grid">
          {workoutDays.map((dayName) => {
            const isToday = dayName === currentDay;
            const isRestDay = dayName === 'Saturday' || dayName === 'Sunday';
            const exerciseCount = getExerciseCount(dayName);
            
            return (
              <div 
                key={dayName}
                className={`workout-day-card ${isToday ? 'today' : ''} ${isRestDay ? 'rest-day' : ''}`}
                onClick={() => handleDayClick(dayName)}
              >
                <div 
                  className="workout-card-bg"
                  style={{ backgroundImage: `url(${getWorkoutImage(dayName)})` }}
                >
                  <div className="workout-overlay"></div>
                </div>
                <div className="workout-card-content">
                  <div className="day-header">
                    <h3>{dayName}</h3>
                    {isToday && <span className="today-badge">TODAY</span>}
                  </div>
                  <div className="workout-info">
                    <h4>{getWorkoutTitle(dayName)}</h4>
                    {isRestDay ? (
                      <p>Active Recovery</p>
                    ) : (
                      <p>{exerciseCount} exercises</p>
                    )}
                  </div>
                  <div className="workout-action">
                    <button className="start-workout-btn anime-btn">
                      <span className="btn-text">BEGIN</span>
                      <span className="btn-icon">⚡</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn anime-btn" onClick={() => handleNavigateTo('/progress')}>
            <span className="btn-icon">📈</span>
            <span className="btn-text">View Progress</span>
          </button>
          <button className="action-btn anime-btn" onClick={() => handleNavigateTo('/diet')}>
            <span className="btn-icon">🥗</span>
            <span className="btn-text">GlowUp</span>
          </button>
          <button className="action-btn anime-btn" onClick={() => handleNavigateTo('/profile')}>
            <span className="btn-icon">👤</span>
            <span className="btn-text">Warrior Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage; 