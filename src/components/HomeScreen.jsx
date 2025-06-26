import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';
import { workoutData } from '../WorkoutData.js';
import { useProgress } from './ProgressContext';

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
  const { getTodayProgress } = useProgress();

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
      return 'Dragon Training';
    } else if (name.includes('squat') || name.includes('lunge') || name.includes('step') || name.includes('bridge')) {
      return 'Ninja Agility';
    } else if (name.includes('plank') || name.includes('crunch') || name.includes('tap')) {
      return 'Core Mastery';
    } else if (name.includes('stretch') || name.includes('pose') || name.includes('cobra') || name.includes('twist')) {
      return 'Spirit Flexibility';
    } else if (name.includes('rest')) {
      return 'Meditation';
    } else if (name.includes('hang') || name.includes('hold')) {
      return 'Endurance Test';
    } else {
      return 'Hero Strength';
    }
  };

  // Get today's workout title
  const getTodaysWorkoutTitle = () => {
    const dayData = workoutData[currentDay];
    if (dayData?.title) {
      return dayData.title;
    }
    const types = [...new Set(todaysExercises.map(exercise => categorizeExercise(exercise.name)))];
    return types.length > 0 ? types[0] : 'Rest & Recovery';
  };

  // Get workout image for today
  const getWorkoutImage = () => {
    switch (currentDay) {
      case 'Monday':
        return coreWorkoutImg; // Baki
      case 'Tuesday':
        return lowerBodyImg; // Vegeta
      case 'Wednesday':
        return flexibilityImg; // Zoro
      case 'Thursday':
        return upperBodyImg; // Goku
      case 'Friday':
        return erenFullbodyImg; // Eren
      case 'Saturday':
        return luffyRestImg; // Luffy Rest
      case 'Sunday':
        return shanksRestImg; // Shanks Rest
      default:
        return muscleImg;
    }
  };

  // Get user stats from ProgressContext
  const getUserStats = () => {
    const todayProgress = getTodayProgress();
    return {
      currentStreak: userData?.currentStreak || 0,
      totalWorkouts: userData?.totalWorkouts || 0,
      thisWeekCompleted: todayProgress.completed || 0,
      thisWeekTotal: todayProgress.total || 0
    };
  };

  const stats = getUserStats();

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
      <div className="progress-section" style={{background:'transparent'}}>
        <h2>Your Warrior Stats</h2>
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
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats.thisWeekCompleted}/{stats.thisWeekTotal}</div>
              <div className="stat-label">This Week's Quest</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="quick-actions-section">
        <h2>Training Grounds</h2>
        <div className="actions-grid">
          <button 
            className="action-card workout-action"
            onClick={() => handleNavigateTo('/workout')}
          >
            <div className="action-icon">🏋️</div>
            <div className="action-text">
              <h3>Combat Training</h3>
              <p>Master your techniques</p>
            </div>
          </button>
          
          <button 
            className="action-card diet-action"
            onClick={() => handleNavigateTo('/diet')}
          >
            <div className="action-icon">🥗</div>
            <div className="action-text">
              <h3>GlowUp</h3>
              <p>Fuel your strength</p>
            </div>
          </button>
          
          <button 
            className="action-card progress-action"
            onClick={() => handleNavigateTo('/progress')}
          >
            <div className="action-icon">📊</div>
            <div className="action-text">
              <h3>Progress Scroll</h3>
              <p>Track your journey</p>
            </div>
          </button>
          
          <button 
            className="action-card profile-action"
            onClick={() => handleNavigateTo('/profile')}
          >
            <div className="action-icon">👤</div>
            <div className="action-text">
              <h3>Warrior Profile</h3>
              <p>Your legend</p>
            </div>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default HomeScreen; 