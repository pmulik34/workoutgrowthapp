import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';
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

const HomeScreen = ({ userData }) => {
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
      return `Greetings, ${firstName}! ⚡`;
    }
    return 'Welcome, Warrior! ⚡';
  };

  // Get current day's exercises
  const todaysExercises = workoutData[currentDay]?.exercises || [];

  // Generate workout types from actual data
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

  const getTodaysWorkoutTitle = () => {
    if (workoutData[currentDay]) {
      return workoutData[currentDay].title;
    }
    return 'Rest Day';
  };

  const getWorkoutImage = () => {
    const workoutType = todaysExercises.length > 0 ? categorizeExercise(todaysExercises[0].name) : 'Rest';
    
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
        return currentDay === 'Saturday' ? luffyRestImg : shanksRestImg;
      default:
        return erenFullbodyImg;
    }
  };

  // Handle navigation
  const handleStartWorkout = () => {
    navigate(`/workout/${currentDay.toLowerCase()}`);
  };

  const handleNavigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="home-screen">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="welcome-text">Your epic training journey continues!</p>
        <div className="anime-quote" style={{background:'transparent'}}>
          <p>"The difference between the impossible and the possible lies in determination."</p>
        </div>
      </div>

      {/* Today's Workout Card */}
      <div className="todays-workout-card">
        <div className="workout-card-header">
          <h2>Today's Mission</h2>
          <span className="workout-day">{currentDay}</span>
        </div>
        <div 
          className="workout-card-content"
          style={{ backgroundImage: `url(${getWorkoutImage()})` }}
        >
          <div className="workout-overlay"></div>
          <div className="workout-info">
            <h3>{getTodaysWorkoutTitle()}</h3>
            <p>{todaysExercises.length} challenges await</p>
          </div>
          <button className="start-workout-btn anime-btn glow-effect" onClick={handleStartWorkout}>
            <span className="btn-text">BEGIN TRAINING</span>
            <span className="btn-icon">⚡</span>
          </button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="progress-stats" style={{background:'transparent'}}>
        <h2>Your Battle Stats</h2>
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
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{progressData.thisWeekCompleted}/{progressData.thisWeekTotal}</div>
              <div className="stat-label">This Week</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-value">{Math.round((progressData.thisWeekCompleted / progressData.thisWeekTotal) * 100)}%</div>
              <div className="stat-label">Weekly Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn anime-btn" onClick={() => handleNavigateTo('/workout')}>
            <span className="btn-icon">🏋️</span>
            <span className="btn-text">View All Workouts</span>
          </button>
          <button className="action-btn anime-btn" onClick={() => handleNavigateTo('/progress')}>
            <span className="btn-icon">📈</span>
            <span className="btn-text">Track Progress</span>
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

export default HomeScreen; 