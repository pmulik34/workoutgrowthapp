import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from './ProgressContext';
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
  const { getTodayProgress, getDayProgress } = useProgress();

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
      return 'Warrior Strength';
    }
  };

  // Get unique workout types for today's exercises
  const getTodaysWorkoutTypes = () => {
    if (todaysExercises.length === 0) return ['Rest & Recovery'];
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
    if (!dayData || !dayData.exercises || dayData.exercises.length === 0) return 'Rest & Recovery';
    
    if (dayData.title) {
      return dayData.title;
    }
    
    const types = [...new Set(dayData.exercises.map(exercise => categorizeExercise(exercise.name)))];
    return types.length > 1 ? `${types[0]} Training` : `${types[0]} Training`;
  };

  // Get workout image for a day
  const getWorkoutImage = (day) => {
    switch (day) {
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

  // Handle card click to navigate to detail page
  const handleCardClick = (day) => {
    navigate(`/workout/${day.toLowerCase()}`);
  };

  // Handle start workout click
  const handleStartWorkout = () => {
    navigate(`/workout/${currentDay.toLowerCase()}`);
  };

  // Get progress status for a specific day
  const getDayProgressStatus = (day) => {
    const dayData = workoutData[day];
    
    // Don't show progress for rest/recovery days
    if (dayData?.type === 'recovery') {
      return null;
    }
    
    // For current day, use today's actual progress
    if (day === currentDay) {
      if (todayProgress.total === 0) return null;
      
      const percentage = (todayProgress.completed / todayProgress.total) * 100;
      return {
        completed: todayProgress.completed,
        total: todayProgress.total,
        percentage: Math.round(percentage)
      };
    }
    
    // For other days, calculate based on the date
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const todayIndex = workoutDays.indexOf(currentDayName);
    const selectedDayIndex = workoutDays.indexOf(day);
    
    // Calculate the date for the selected day
    const selectedDate = new Date(today);
    selectedDate.setDate(today.getDate() + (selectedDayIndex - todayIndex));
    
    const dayKey = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD format
    const progress = getDayProgress(dayKey);
    
    if (progress.total === 0) return null;
    
    const percentage = (progress.completed / progress.total) * 100;
    return {
      completed: progress.completed,
      total: progress.total,
      percentage: Math.round(percentage)
    };
  };

  // Get today's progress
  const todayProgress = getTodayProgress();

  return (
    <div className="workout-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Choose your training path and become stronger!</p>
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
          </div>
        </div>
        <button className="start-workout-btn anime-btn glow-effect" onClick={handleStartWorkout}>
          <span className="btn-text">BEGIN TRAINING</span>
          <span className="btn-icon">⚡</span>
        </button>
      </div>

      {/* Weekly Exercise Cards */}
      <div className="weekly-exercises">
        <h2>Weekly Training Schedule</h2>
        <div className="exercise-cards-container">
          {getAllDays().map((day) => {
            const progressStatus = getDayProgressStatus(day);
            
            return (
            <div 
              key={day} 
              className={`exercise-card ${day === currentDay ? 'current-day' : ''}`}
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
                    {progressStatus && (
                      <div className="exercise-progress-indicator">
                        <div
                          className="progress-circle"
                          style={{
                            background: `conic-gradient(
                              #4da3ff 0 ${progressStatus.percentage * 3.6}deg,
                              #e0e0e0 ${progressStatus.percentage * 3.6}deg 360deg
                            )`
                          }}
                        />
                      </div>
                    )}
                </div>
                <div className="exercise-card-details">
                    <span className="exercise-count">
                      {(() => {
                        const dayData = workoutData[day];
                        const warmupData = workoutData.Warmup;
                        
                        // Check if it's a rest/recovery day
                        if (dayData?.type === 'recovery') {
                          return 'Rest Day';
                        }
                        
                        const mainExercises = dayData?.exercises?.length || 0;
                        const warmupExercises = warmupData?.exercises?.length || 0;
                        const totalExercises = mainExercises + warmupExercises;
                        return `${totalExercises} challenges`;
                      })()}
                      {progressStatus && (
                        <span className="progress-count">
                          {progressStatus.completed}/{progressStatus.total} completed
                        </span>
                      )}
                    </span>
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