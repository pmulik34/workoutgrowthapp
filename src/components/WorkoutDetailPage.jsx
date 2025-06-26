import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from './ProgressContext';
import './WorkoutDetailPage.css';
import { workoutData } from '../WorkoutData.js';

const WorkoutDetailPage = () => {
  const { day } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { markExerciseAsDone, getTodayProgress, getTodayKey, initializeExercisesForDay, getDayProgress } = useProgress();
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [isLocked, setIsLocked] = useState(false);

  // Capitalize the day parameter to match workoutData keys
  const selectedDay = day ? day.charAt(0).toUpperCase() + day.slice(1) : null;

  // Get workout data early
  const dayData = workoutData[selectedDay];
  const warmupData = workoutData.Warmup;
  const isRecoveryDay = dayData?.type === 'recovery';

  // Get current week info
  const getCurrentWeekInfo = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayDate = new Date(today);
    
    // Calculate Monday of current week
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Handle Sunday as 0
    mondayDate.setDate(today.getDate() + diff);
    
    const weekId = `week_${mondayDate.getFullYear()}_${mondayDate.getMonth()}_${mondayDate.getDate()}`;
    
    return {
      weekId,
      mondayDate: mondayDate.toISOString().split('T')[0],
      currentWeekStart: mondayDate
    };
  };

  // Helper to get the dateKey for the selected day in the current week
  const getSelectedDayKey = () => {
    const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const todayIndex = workoutDays.indexOf(currentDayName);
    const selectedDayIndex = workoutDays.indexOf(selectedDay);
    const selectedDate = new Date(today);
    selectedDate.setDate(today.getDate() + (selectedDayIndex - todayIndex));
    return selectedDate.toISOString().slice(0, 10);
  };

  // Load saved progress from ProgressContext
  useEffect(() => {
    if (selectedDay && dayData) {
      const selectedDayKey = getSelectedDayKey();
      const dayProgress = getDayProgress(selectedDayKey);
      
      // Load completed exercises from progress context
      const completedIds = Object.keys(dayProgress.exercises || {}).filter(
        id => dayProgress.exercises[id]
      );
      setCompletedExercises(new Set(completedIds));
      
      // Check if this is a future day or past day (but don't lock access to content)
      const today = new Date();
      const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const todayIndex = workoutDays.indexOf(currentDayName);
      const selectedDayIndex = workoutDays.indexOf(selectedDay);
      
      // Set locked status for future days AND past days (prevents marking as completed)
      setIsLocked(selectedDayIndex !== todayIndex);
    }
  }, [selectedDay, dayData, warmupData, isRecoveryDay, getDayProgress, location.pathname]);

  // Separate effect to initialize exercises only once for current day
  useEffect(() => {
    if (selectedDay && dayData && !isRecoveryDay) {
      const today = new Date();
      const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (selectedDay === currentDayName) {
        const selectedDayKey = getSelectedDayKey();
        const todayProgress = getDayProgress(selectedDayKey);
        const existingExercises = Object.keys(todayProgress.exercises || {});
        
        // Only initialize if no exercises exist for today
        if (existingExercises.length === 0) {
          // Initialize exercises in progress context
          const warmupExercises = warmupData?.exercises || [];
          const mainExercises = dayData?.exercises || [];
          
          // Create exercise IDs
          const allExercises = [
            ...warmupExercises.map((_, index) => `warmup_${index}`),
            ...mainExercises.map((_, index) => `main_${index}`)
          ];
          
          // Initialize all exercises at once
          if (allExercises.length > 0) {
            initializeExercisesForDay(selectedDayKey, allExercises);
          }
        }
      }
    }
  }, [selectedDay, dayData, warmupData, isRecoveryDay, getDayProgress, initializeExercisesForDay]);

  // Effect to handle navigation when location changes
  useEffect(() => {
    // Handle navigation changes
  }, [location.pathname]);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
    };
  }, []);

  // Handle back navigation
  const handleBack = () => {
    navigate('/workout', { replace: true });
  };

  if (!selectedDay) {
    navigate('/workout', { replace: true });
    return null;
  }

  // Calculate total exercises (warmup + main workout) - only for non-recovery days
  const totalExercises = isRecoveryDay ? 0 : (warmupData?.exercises?.length || 0) + (dayData?.exercises?.length || 0);
  
  // Calculate completed exercises correctly - only count exercises that exist for this day
  const getCompletedCount = () => {
    if (isRecoveryDay) return 0;
    
    let completedCount = 0;
    
    // Count completed warmup exercises
    if (warmupData?.exercises) {
      warmupData.exercises.forEach((_, index) => {
        if (completedExercises.has(`warmup_${index}`)) {
          completedCount++;
        }
      });
    }
    
    // Count completed main exercises
    if (dayData?.exercises) {
      dayData.exercises.forEach((_, index) => {
        if (completedExercises.has(`main_${index}`)) {
          completedCount++;
        }
      });
    }
    
    return completedCount;
  };
  
  const completedCount = getCompletedCount();
  const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  // Toggle exercise completion (only if not locked)
  const toggleExerciseCompletion = (exerciseId) => {
    if (isLocked) return;
    
    const selectedDayKey = getSelectedDayKey();
    const isCompleted = completedExercises.has(exerciseId);
    
    if (isCompleted) {
      // Remove from completed set
      setCompletedExercises(prev => {
        const newSet = new Set(prev);
        newSet.delete(exerciseId);
        return newSet;
      });
      // Mark as not done in progress context
      markExerciseAsDone(selectedDayKey, exerciseId, false);
    } else {
      // Add to completed set
      setCompletedExercises(prev => {
        const newSet = new Set([...prev, exerciseId]);
        return newSet;
      });
      // Mark as done in progress context
      markExerciseAsDone(selectedDayKey, exerciseId, true);
    }
  };

  // Mark all exercises as done
  const markAllAsDone = () => {
    if (isLocked || isRecoveryDay) return;
    
    const selectedDayKey = getSelectedDayKey();
    const warmupExercises = warmupData?.exercises || [];
    const mainExercises = dayData?.exercises || [];
    
    const allExercises = [
      ...warmupExercises.map((_, index) => `warmup_${index}`),
      ...mainExercises.map((_, index) => `main_${index}`)
    ];
    
    const newCompletedSet = new Set(allExercises);
    setCompletedExercises(newCompletedSet);
    
    // Mark all exercises as done in progress context
    allExercises.forEach(exerciseId => {
      markExerciseAsDone(selectedDayKey, exerciseId, true);
    });
  };

  // Mark all exercises as undone
  const markAllAsUndone = () => {
    if (isLocked || isRecoveryDay) return;
    
    const selectedDayKey = getSelectedDayKey();
    const warmupExercises = warmupData?.exercises || [];
    const mainExercises = dayData?.exercises || [];
    
    const allExercises = [
      ...warmupExercises.map((_, index) => `warmup_${index}`),
      ...mainExercises.map((_, index) => `main_${index}`)
    ];
    
    setCompletedExercises(new Set());
    
    // Mark all exercises as not done in progress context
    allExercises.forEach(exerciseId => {
      markExerciseAsDone(selectedDayKey, exerciseId, false);
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

  // Check if today or future day
  const today = new Date();
  const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayIndex = workoutDays.indexOf(currentDayName);
  const selectedDayIndex = workoutDays.indexOf(selectedDay);
  const isFutureDay = selectedDayIndex > todayIndex;
  const isPastDay = selectedDayIndex < todayIndex;
  const isCurrentDay = selectedDayIndex === todayIndex;

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
          {/* Show status indicators */}
          {isFutureDay && !isRecoveryDay && (
            <div className="day-status future">🔮 Preview Mode - Videos Available</div>
          )}
          {isPastDay && !isRecoveryDay && (
            <div className="day-status past">📅 Past Day - View Only</div>
          )}
          {isCurrentDay && !isRecoveryDay && (
            <div className="day-status current">⚡ Today's Workout - Ready to Train!</div>
          )}
        </div>
      </div>

      {/* Progress Section - Only show for current day */}
      {!isRecoveryDay && isCurrentDay && (
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
          
          {/* Bulk Action Buttons */}
          <div className="bulk-actions">
            <button 
              className="bulk-action-btn mark-all-done"
              onClick={markAllAsDone}
              disabled={completedCount === totalExercises}
            >
              <span className="btn-icon">✅</span>
              <span className="btn-text">Mark All Done</span>
            </button>
            <button 
              className="bulk-action-btn mark-all-undone"
              onClick={markAllAsUndone}
              disabled={completedCount === 0}
            >
              <span className="btn-icon">❌</span>
              <span className="btn-text">Mark All Undone</span>
            </button>
          </div>
        </div>
      )}

      {/* Future Day Notice - Show but don't block content */}
      {(isFutureDay || isPastDay) && !isRecoveryDay && (
        <div className="future-day-notice">
          <div className="future-notice-content">
            <h3>{isFutureDay ? '🔮 Preview Mode' : '📅 Past Day'}</h3>
            <p>
              {isFutureDay 
                ? `You can view the workout and access exercise videos, but you can't mark exercises as completed until ${selectedDay}.`
                : 'You can view the workout and access exercise videos, but you can\'t modify the exercise status for past days.'
              }
            </p>
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
          /* Regular Workout Content - Show for all days including future */
          <>
            {/* Warmup Section */}
            <div className="workout-section">
              <div className="section-header">
                <h2>Warmup</h2>
                <span className="section-count">{warmupData.exercises.length} exercises</span>
              </div>
              
              {/* Completed Warmup Exercises - Show First */}
              {warmupData.exercises.some((_, index) => completedExercises.has(`warmup_${index}`)) && (
                <div className="exercise-list completed-exercises">
                  <h3 className="section-subtitle completed">✅ Done</h3>
                  {(() => {
                    return warmupData.exercises.map((exercise, index) => {
                      const exerciseId = `warmup_${index}`;
                      const isCompleted = completedExercises.has(exerciseId);
                      
                      if (!isCompleted) return null; // Skip incomplete exercises here
                      
                      return (
                        <div key={index} className="exercise-item completed">
                          <div className="exercise-checkbox-container">
                            <input
                              type="checkbox"
                              id={exerciseId}
                              className="exercise-checkbox"
                              checked={true}
                              onChange={() => toggleExerciseCompletion(exerciseId)}
                              disabled={isLocked}
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
                    });
                  })()}
                </div>
              )}
              
              {/* Remaining Warmup Exercises - Show Second */}
              {warmupData.exercises.some((_, index) => !completedExercises.has(`warmup_${index}`)) && (
                <div className="exercise-list">
                  <h3 className="section-subtitle">Remaining</h3>
                  {warmupData.exercises.map((exercise, index) => {
                    const exerciseId = `warmup_${index}`;
                    const isCompleted = completedExercises.has(exerciseId);
                    
                    if (isCompleted) return null; // Skip completed exercises here
                    
                    return (
                      <div key={index} className={`exercise-item ${isLocked ? 'locked' : ''}`}>
                        <div className="exercise-checkbox-container">
                          <input
                            type="checkbox"
                            id={exerciseId}
                            className="exercise-checkbox"
                            checked={false}
                            onChange={() => toggleExerciseCompletion(exerciseId)}
                            disabled={isLocked}
                          />
                          <label htmlFor={exerciseId} className={`checkbox-label ${isLocked ? 'disabled' : ''}`}>
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
              )}
            </div>

            {/* Main Workout Section */}
            {dayData && dayData.exercises && dayData.exercises.length > 0 ? (
              <div className="workout-section">
                <div className="section-header">
                  <h2>Main Workout</h2>
                  <span className="section-count">{dayData.exercises.length} exercises</span>
                </div>
                
                {/* Completed Main Exercises - Show First */}
                {dayData.exercises.some((_, index) => completedExercises.has(`main_${index}`)) && (
                  <div className="exercise-list completed-exercises">
                    <h3 className="section-subtitle completed">✅ Done</h3>
                    {(() => {
                      return dayData.exercises.map((exercise, index) => {
                        const exerciseId = `main_${index}`;
                        const isCompleted = completedExercises.has(exerciseId);
                        
                        if (!isCompleted) return null; // Skip incomplete exercises here
                        
                        return (
                          <div key={index} className="exercise-item completed">
                            <div className="exercise-checkbox-container">
                              <input
                                type="checkbox"
                                id={exerciseId}
                                className="exercise-checkbox"
                                checked={true}
                                onChange={() => toggleExerciseCompletion(exerciseId)}
                                disabled={isLocked}
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
                      });
                    })()}
                  </div>
                )}
                
                {/* Remaining Main Exercises - Show Second */}
                {dayData.exercises.some((_, index) => !completedExercises.has(`main_${index}`)) && (
                  <div className="exercise-list">
                    <h3 className="section-subtitle">Remaining</h3>
                    {dayData.exercises.map((exercise, index) => {
                      const exerciseId = `main_${index}`;
                      const isCompleted = completedExercises.has(exerciseId);
                      
                      if (isCompleted) return null; // Skip completed exercises here
                      
                      return (
                        <div key={index} className={`exercise-item ${isLocked ? 'locked' : ''}`}>
                          <div className="exercise-checkbox-container">
                            <input
                              type="checkbox"
                              id={exerciseId}
                              className="exercise-checkbox"
                              checked={false}
                              onChange={() => toggleExerciseCompletion(exerciseId)}
                              disabled={isLocked}
                            />
                            <label htmlFor={exerciseId} className={`checkbox-label ${isLocked ? 'disabled' : ''}`}>
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
                )}
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