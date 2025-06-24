import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkoutPage.css';
import { workoutData } from '../WorkoutData.js';

// Import workout images
import upperBodyImg from '../assets/upperbody.jpeg';
import lowerBodyImg from '../assets/lowerbody.jpeg';
import coreWorkoutImg from '../assets/coreworkout.jpeg';
import flexibilityImg from '../assets/flexibility.jpeg';
import muscleImg from '../assets/muscle.png';

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [weeklyProgress, setWeeklyProgress] = useState({});

  // Get current day
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const userName = "John Doe"; // You can make this dynamic later

  // Load weekly progress from localStorage
  useEffect(() => {
    const loadWeeklyProgress = () => {
      const workoutStorage = JSON.parse(localStorage.getItem('workoutAppStorage')) || {};
      console.log('WorkoutPage: Loading progress data:', workoutStorage.dailyProgress);
      setWeeklyProgress(workoutStorage.dailyProgress || {});
    };

    // Load immediately when component mounts
    loadWeeklyProgress();
    
    // Set up interval to check for updates every 500ms when component is active
    const interval = setInterval(loadWeeklyProgress, 500);
    
    // Listen for storage changes to update progress in real-time
    const handleStorageChange = () => {
      console.log('Storage changed, reloading progress');
      loadWeeklyProgress();
    };

    // Listen for focus events to reload when returning to tab
    const handleFocus = () => {
      console.log('Window focused, reloading progress');
      loadWeeklyProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    // Also check for updates when component becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('Page became visible, reloading progress');
        loadWeeklyProgress();
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', loadWeeklyProgress);
    };
  }, []);

  // Also reload when component re-mounts or updates
  useEffect(() => {
    const workoutStorage = JSON.parse(localStorage.getItem('workoutAppStorage')) || {};
    setWeeklyProgress(workoutStorage.dailyProgress || {});
  }, [currentDay]); // Reload when day changes

  // Get day progress key
  const getDayProgressKey = (dayName) => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return `${todayKey}_${dayName}`;
  };

  // Get progress for a specific day
  const getDayProgress = (dayName) => {
    const progressKey = getDayProgressKey(dayName);
    return weeklyProgress[progressKey] || {
      progress: 0,
      completedExercises: 0,
      totalExercises: calculateTotalExercises(dayName),
      isCompleted: false
    };
  };

  // Calculate total exercises for a day
  const calculateTotalExercises = (dayName) => {
    const dayData = workoutData[dayName];
    if (dayData?.type === 'recovery') return 0;
    
    const warmupData = workoutData.Warmup;
    return (warmupData?.exercises?.length || 0) + (dayData?.exercises?.length || 0);
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

  // Get unique workout types for today's exercises
  const getTodaysWorkoutTypes = () => {
    if (todaysExercises.length === 0) return ['Rest Day'];
    const types = [...new Set(todaysExercises.map(exercise => categorizeExercise(exercise.name)))];
    return types;
  };

  // Get today's workout title or generate from types
  const getTodaysWorkoutTitle = () => {
    const dayData = workoutData[currentDay];
    if (dayData?.title) {
      return dayData.title;
    }
    return getTodaysWorkoutTypes()[0];
  };

  // Generate all available days from workoutData
  const getAllDays = () => {
    return Object.keys(workoutData).filter(day => day !== 'Warmup');
  };

  // Get workout summary for a specific day
  const getDayWorkoutSummary = (day) => {
    const dayData = workoutData[day];
    if (!dayData || !dayData.exercises || dayData.exercises.length === 0) return 'Rest Day';
    
    if (dayData.title) {
      return dayData.title;
    }
    
    const types = [...new Set(dayData.exercises.map(exercise => categorizeExercise(exercise.name)))];
    return types.length > 1 ? `${types[0]} Workout` : `${types[0]} Workout`;
  };

  // Get workout image for a day
  const getWorkoutImage = (day) => {
    const dayData = workoutData[day];
    if (!dayData || !dayData.exercises || dayData.exercises.length === 0) return flexibilityImg;
    
    const types = [...new Set(dayData.exercises.map(exercise => categorizeExercise(exercise.name)))];
    const primaryType = types[0];
    
    switch (primaryType) {
      case 'Upper Body': return upperBodyImg;
      case 'Lower Body': return lowerBodyImg;
      case 'Core': return coreWorkoutImg;
      case 'Flexibility': return flexibilityImg;
      case 'Endurance': return muscleImg;
      case 'Recovery': return flexibilityImg;
      default: return muscleImg;
    }
  };

  // Get day status class
  const getDayStatusClass = (day) => {
    const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const todayIndex = workoutDays.indexOf(currentDay);
    const dayIndex = workoutDays.indexOf(day);
    
    if (day === currentDay) {
      return 'current-day';
    } else if (dayIndex < todayIndex) {
      return 'past-day';
    } else if (dayIndex > todayIndex) {
      return 'future-day';
    }
    return '';
  };

  // Handle card click to navigate to detail page
  const handleCardClick = (day) => {
    navigate(`/workout/${day.toLowerCase()}`);
  };

  // Handle start workout click
  const handleStartWorkout = () => {
    navigate(`/workout/${currentDay.toLowerCase()}`);
  };

  return (
    <div className="workout-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>Hi! 👋</h1>
        <p className="tagline">Make your body perfect!</p>
      </div>

      {/* Today's Workout Widget */}
      <div 
        className="todays-workout-widget"
        style={{ backgroundImage: `url(${getWorkoutImage(currentDay)})` }}
      >
        <div className="workout-widget-content">
          <div className="workout-widget-info">
            <h3>{currentDay}</h3>
            <p className="workout-type-main">{getTodaysWorkoutTitle()}</p>
            {/* Show today's progress */}
            {getDayProgress(currentDay).totalExercises > 0 && (
              <div className="today-progress">
                {getDayProgress(currentDay).completedExercises}/{getDayProgress(currentDay).totalExercises} exercises • {getDayProgress(currentDay).progress}%
              </div>
            )}
          </div>
        </div>
        <button className="start-workout-btn" onClick={handleStartWorkout}>
          Start Workout
        </button>
      </div>

      {/* Weekly Exercise Cards */}
      <div className="weekly-exercises">
        <h2>Weekly Exercises</h2>
        <div className="exercise-cards-container">
          {getAllDays().map((day) => {
            const dayProgress = getDayProgress(day);
            return (
              <div 
                key={day} 
                className={`exercise-card ${getDayStatusClass(day)}`}
                style={{ backgroundImage: `url(${getWorkoutImage(day)})` }}
                onClick={() => handleCardClick(day)}
              >
                <div className="exercise-card-overlay"></div>
                <div className="exercise-card-content">
                  <div className="exercise-card-header">
                    <div className="exercise-card-info">
                      <h4>{day}</h4>
                      <p className="exercise-card-type">{getDayWorkoutSummary(day)}</p>
                    </div>
                    {day !== currentDay && (
                      <div className="day-status-icon">
                        {getDayStatusClass(day) === 'past-day' ? '🔒' : '🔮'}
                      </div>
                    )}
                    {dayProgress.isCompleted && (
                      <div className="completion-badge">✅</div>
                    )}
                  </div>
                  <div className="exercise-card-details">
                    <span className="exercise-count">{dayProgress.totalExercises} exercises</span>
                    {dayProgress.totalExercises > 0 && (
                      <div className="progress-indicator">
                        <div className="mini-progress-bar">
                          <div 
                            className="mini-progress-fill" 
                            style={{ width: `${dayProgress.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{dayProgress.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage; 