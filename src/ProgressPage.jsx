import React from 'react';
import { useProgress } from './ProgressContext';
import { workoutData } from '../WorkoutData.js';
import './ProgressPage.css';

const ProgressPage = ({ userData }) => {
  const { progress, getCurrentStreak, getTimeBasedProgress } = useProgress();

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

  // Calculate total workouts completed
  const calculateTotalWorkouts = () => {
    let totalWorkouts = 0;
    Object.keys(progress.byDate).forEach(dateKey => {
      const dayData = progress.byDate[dateKey];
      if (dayData?.status === 'done') {
        totalWorkouts++;
      }
    });
    return totalWorkouts;
  };

  // Calculate this week's progress
  const calculateThisWeekProgress = () => {
    const weekProgress = getTimeBasedProgress('week');
    return {
      completed: weekProgress.completed,
      total: weekProgress.total
    };
  };

  const totalCaloriesBurned = calculateTotalCaloriesBurned();
  const totalWorkouts = calculateTotalWorkouts();
  const currentStreak = getCurrentStreak();
  const weekProgress = calculateThisWeekProgress();

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
              <div className="stat-value">{currentStreak}</div>
              <div className="stat-label">Battle Streak</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚔️</div>
            <div className="stat-content">
              <div className="stat-value">{totalWorkouts}</div>
              <div className="stat-label">Missions Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{formatTime(1800)}</div>
              <div className="stat-label">Total Training Time</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-value">{totalCaloriesBurned.toLocaleString()}</div>
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
                style={{ width: `${getProgressPercentage(weekProgress.completed, 7)}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {weekProgress.completed} of 7 days completed
            </div>
          </div>
          <div className="progress-percentage">
            {Math.round(getProgressPercentage(weekProgress.completed, 7))}%
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
              <p>40 minutes</p>
            </div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">⚔️</div>
            <div className="achievement-content">
              <h3>Favorite Training Type</h3>
              <p>Dragon Training</p>
            </div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">🔥</div>
            <div className="achievement-content">
              <h3>Current Streak</h3>
              <p>{currentStreak} days</p>
            </div>
          </div>
          <div className="achievement-card">
            <div className="achievement-icon">📈</div>
            <div className="achievement-content">
              <h3>Total Missions</h3>
              <p>{totalWorkouts} completed</p>
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
              <span className="stat-number">{currentStreak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="motivation-stat">
              <span className="stat-number">{totalWorkouts}</span>
              <span className="stat-label">Total Workouts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 