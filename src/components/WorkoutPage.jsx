import React from 'react';
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

  // Get current day
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const userName = "John Doe"; // You can make this dynamic later

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
          {getAllDays().map((day) => (
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
                </div>
                <div className="exercise-card-details">
                  <span className="exercise-count">{workoutData[day]?.exercises?.length || 0} exercises</span>
                  {/* Duration removed from all cards */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage; 