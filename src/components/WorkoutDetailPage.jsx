import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WorkoutDetailPage.css';
import { workoutData } from '../WorkoutData.js';

const WorkoutDetailPage = () => {
  const { day } = useParams();
  const navigate = useNavigate();
  const [completedExercises, setCompletedExercises] = useState(new Set());

  // Capitalize the day parameter to match workoutData keys
  const selectedDay = day ? day.charAt(0).toUpperCase() + day.slice(1) : null;

  // Load saved progress from localStorage on component mount
  useEffect(() => {
    if (selectedDay) {
      const savedProgress = localStorage.getItem(`workout_progress_${selectedDay}`);
      if (savedProgress) {
        setCompletedExercises(new Set(JSON.parse(savedProgress)));
      }
    }
  }, [selectedDay]);

  // Save progress to localStorage whenever completedExercises changes
  useEffect(() => {
    if (selectedDay) {
      localStorage.setItem(`workout_progress_${selectedDay}`, JSON.stringify([...completedExercises]));
    }
  }, [completedExercises, selectedDay]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/workout');
  };

  if (!selectedDay) {
    navigate('/workout');
    return null;
  }

  const dayData = workoutData[selectedDay];
  const warmupData = workoutData.Warmup;

  // Check if this is a recovery day
  const isRecoveryDay = dayData?.type === 'recovery';

  // Calculate total exercises (warmup + main workout) - only for non-recovery days
  const totalExercises = isRecoveryDay ? 0 : (warmupData?.exercises?.length || 0) + (dayData?.exercises?.length || 0);
  const completedCount = completedExercises.size;
  const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  // Toggle exercise completion
  const toggleExerciseCompletion = (exerciseId) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  // Get workout image for the day
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

  const handleVideoClick = (videoLink) => {
    window.open(videoLink, '_blank');
  };

  const formatReps = (reps) => {
    return reps || '1 min';
  };

  return (
    <div className="workout-detail-page">
      {/* Header */}
      <div className="workout-detail-header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-arrow">←</span>
        </button>
        <div className="workout-detail-info">
          <h1>{selectedDay}</h1>
          <p className="workout-detail-subtitle">
            {dayData?.title || `${categorizeExercise(dayData?.exercises?.[0]?.name || '')} Workout`}
          </p>
        </div>
      </div>

      {/* Progress Section - Only show for non-recovery days */}
      {!isRecoveryDay && (
        <div className="progress-section">
          <div className="progress-header">
            <h3>Workout Progress</h3>
            <span className="progress-stats">{completedCount}/{totalExercises} completed</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
        </div>
      )}

      {/* Workout Content */}
      <div className="workout-detail-content">
        {isRecoveryDay ? (
          /* Recovery Day Instructions */
          <div className="recovery-day-section">
            <div className="recovery-description">
              <p className="recovery-intro">{dayData.instructions.description}</p>
            </div>
            
            <div className="recovery-activities">
              <h2>Recommended Activities</h2>
              <div className="activity-list">
                {dayData.instructions.activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-header">
                      <h3 className="activity-name">{activity.name}</h3>
                      <span className="activity-duration">{activity.duration}</span>
                    </div>
                    <p className="activity-description">{activity.description}</p>
                    <p className="activity-benefits"><strong>Benefits:</strong> {activity.benefits}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="recovery-tips">
              <h2>Recovery Tips</h2>
              <div className="tips-list">
                {dayData.instructions.tips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <span className="tip-bullet">💡</span>
                    <p className="tip-text">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Regular Workout Content */
          <>
            {/* Warmup Section */}
            <div className="workout-section">
              <div className="section-header">
                <h2>Warmup</h2>
                <span className="section-count">{warmupData.exercises.length} exercises</span>
              </div>
              <div className="exercise-list">
                {warmupData.exercises.map((exercise, index) => {
                  const exerciseId = `warmup_${index}`;
                  const isCompleted = completedExercises.has(exerciseId);
                  
                  return (
                    <div key={index} className={`exercise-item ${isCompleted ? 'completed' : ''}`}>
                      <div className="exercise-checkbox-container">
                        <input
                          type="checkbox"
                          id={exerciseId}
                          className="exercise-checkbox"
                          checked={isCompleted}
                          onChange={() => toggleExerciseCompletion(exerciseId)}
                        />
                        <label htmlFor={exerciseId} className="checkbox-label">
                          <div className="checkbox-custom">
                            <svg className="checkbox-icon" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </div>
                        </label>
                      </div>
                      <div className="exercise-info">
                        <h3 className="exercise-name">{exercise.name}</h3>
                        <p className="exercise-duration">{formatReps(exercise.reps)}</p>
                      </div>
                      <button 
                        className="play-button"
                        onClick={() => handleVideoClick(exercise.link)}
                      >
                        <div className="play-icon">▶</div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Workout Section */}
            {dayData && dayData.exercises && dayData.exercises.length > 0 ? (
              <div className="workout-section">
                <div className="section-header">
                  <h2>Main Workout</h2>
                  <span className="section-count">{dayData.exercises.length} exercises</span>
                </div>
                <div className="exercise-list">
                  {dayData.exercises.map((exercise, index) => {
                    const exerciseId = `main_${index}`;
                    const isCompleted = completedExercises.has(exerciseId);
                    
                    return (
                      <div key={index} className={`exercise-item ${isCompleted ? 'completed' : ''}`}>
                        <div className="exercise-checkbox-container">
                          <input
                            type="checkbox"
                            id={exerciseId}
                            className="exercise-checkbox"
                            checked={isCompleted}
                            onChange={() => toggleExerciseCompletion(exerciseId)}
                          />
                          <label htmlFor={exerciseId} className="checkbox-label">
                            <div className="checkbox-custom">
                              <svg className="checkbox-icon" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                            </div>
                          </label>
                        </div>
                        <div className="exercise-info">
                          <h3 className="exercise-name">{exercise.name}</h3>
                          <p className="exercise-duration">{formatReps(exercise.reps)}</p>
                        </div>
                        <button 
                          className="play-button"
                          onClick={() => handleVideoClick(exercise.link)}
                        >
                          <div className="play-icon">▶</div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rest-day-section">
                <div className="rest-day-content">
                  <h2>Rest Day</h2>
                  <p>Take a well-deserved break! Recovery is just as important as training.</p>
                  <div className="rest-day-tips">
                    <h3>Recovery Tips:</h3>
                    <ul>
                      <li>Stay hydrated</li>
                      <li>Get quality sleep</li>
                      <li>Light stretching</li>
                      <li>Proper nutrition</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailPage; 