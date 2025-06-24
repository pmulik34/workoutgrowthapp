import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WorkoutDetailPage.css';
import { workoutData } from '../WorkoutData.js';

const WorkoutDetailPage = () => {
  const { day } = useParams();
  const navigate = useNavigate();
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [isLocked, setIsLocked] = useState(false);

  // Capitalize the day parameter to match workoutData keys
  const selectedDay = day ? day.charAt(0).toUpperCase() + day.slice(1) : null;

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

  // Initialize or get workout data structure
  const initializeWorkoutData = () => {
    const { weekId } = getCurrentWeekInfo();
    let workoutDataStore = JSON.parse(localStorage.getItem('workoutDataStore')) || {};
    
    // Check if we need to start a new week (reset previous week's checkmarks)
    if (!workoutDataStore.currentWeek || workoutDataStore.currentWeek !== weekId) {
      // New week detected - reset all exercise checkmarks but keep completion history
      workoutDataStore = {
        currentWeek: weekId,
        weeklyProgress: {}, // Reset weekly exercise checkmarks
        completionHistory: workoutDataStore.completionHistory || {}, // Keep historical completion data
        statistics: workoutDataStore.statistics || {
          totalWorkouts: 0,
          currentStreak: 0,
          lastWorkoutDate: null
        }
      };
      
      localStorage.setItem('workoutDataStore', JSON.stringify(workoutDataStore));
    }
    
    return workoutDataStore;
  };

  // Check if user can interact with this day's workout
  const checkDayAccessibility = () => {
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Recovery days are always accessible (but no checkboxes anyway)
    if (workoutData[selectedDay]?.type === 'recovery') {
      return true;
    }
    
    // Define workout day order
    const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const todayIndex = workoutDays.indexOf(currentDayName);
    const selectedDayIndex = workoutDays.indexOf(selectedDay);
    
    // Can't access future days beyond today
    if (selectedDayIndex > todayIndex) {
      return false;
    }
    
    // Can access today
    if (selectedDayIndex === todayIndex) {
      return true;
    }
    
    // For past days, check if they were completed when they were "today"
    const { weekId } = getCurrentWeekInfo();
    const workoutDataStore = JSON.parse(localStorage.getItem('workoutDataStore')) || {};
    const dayCompletionKey = `${weekId}_${selectedDay}`;
    
    // If past day was completed, can still view but not modify
    // If past day was missed, can only view (locked)
    return workoutDataStore.completionHistory?.[dayCompletionKey] ? 'view-only' : 'locked';
  };

  // Load saved progress from localStorage
  useEffect(() => {
    if (selectedDay) {
      const workoutDataStore = initializeWorkoutData();
      const { weekId } = getCurrentWeekInfo();
      const dayProgressKey = `${weekId}_${selectedDay}`;
      
      // Load this week's progress for this day
      const dayProgress = workoutDataStore.weeklyProgress?.[dayProgressKey] || [];
      setCompletedExercises(new Set(dayProgress));
      
      // Check accessibility
      const accessibility = checkDayAccessibility();
      setIsLocked(accessibility === 'locked');
    }
  }, [selectedDay]);

  // Save progress to localStorage whenever completedExercises changes
  useEffect(() => {
    if (selectedDay) {
      const workoutDataStore = initializeWorkoutData();
      const { weekId } = getCurrentWeekInfo();
      const dayProgressKey = `${weekId}_${selectedDay}`;
      
      // Update weekly progress
      workoutDataStore.weeklyProgress[dayProgressKey] = [...completedExercises];
      
      // Check if workout is completed and update completion status
      checkWorkoutCompletion(workoutDataStore, weekId);
      
      localStorage.setItem('workoutDataStore', JSON.stringify(workoutDataStore));
    }
  }, [completedExercises, selectedDay]);

  // Check if the entire workout is completed
  const checkWorkoutCompletion = (workoutDataStore, weekId) => {
    const dayData = workoutData[selectedDay];
    if (dayData?.type === 'recovery') return; // Skip for recovery days
    
    const warmupData = workoutData.Warmup;
    const totalExercises = (warmupData?.exercises?.length || 0) + (dayData?.exercises?.length || 0);
    
    const isCompleted = completedExercises.size === totalExercises;
    const dayCompletionKey = `${weekId}_${selectedDay}`;
    
    if (isCompleted) {
      // Mark day as completed in history
      workoutDataStore.completionHistory[dayCompletionKey] = {
        completed: true,
        completedDate: new Date().toISOString(),
        totalExercises: totalExercises
      };
      
      // Update statistics
      updateProgressStats(workoutDataStore, dayCompletionKey);
    } else {
      // Remove completion if unchecked
      if (workoutDataStore.completionHistory[dayCompletionKey]) {
        delete workoutDataStore.completionHistory[dayCompletionKey];
      }
    }
  };

  // Update progress statistics
  const updateProgressStats = (workoutDataStore, dayCompletionKey) => {
    const today = new Date().toISOString().split('T')[0];
    const stats = workoutDataStore.statistics;
    
    // Check if this completion was already counted
    const alreadyCounted = workoutDataStore.completionHistory[dayCompletionKey]?.counted;
    
    if (!alreadyCounted) {
      stats.totalWorkouts += 1;
      workoutDataStore.completionHistory[dayCompletionKey].counted = true;
      
      // Update streak
      if (stats.lastWorkoutDate) {
        const lastDate = new Date(stats.lastWorkoutDate);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          stats.currentStreak += 1;
        } else if (diffDays > 1) {
          stats.currentStreak = 1;
        }
      } else {
        stats.currentStreak = 1;
      }
      
      stats.lastWorkoutDate = today;
    }
  };

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

  // Toggle exercise completion (only if not locked)
  const toggleExerciseCompletion = (exerciseId) => {
    if (isLocked) return; // Prevent interaction if locked
    
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

  // Check if today or future day
  const today = new Date();
  const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayIndex = workoutDays.indexOf(currentDayName);
  const selectedDayIndex = workoutDays.indexOf(selectedDay);
  const isFutureDay = selectedDayIndex > todayIndex;
  const isPastDay = selectedDayIndex < todayIndex;

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
            <div className="day-status future">🔮 Future Workout</div>
          )}
          {isPastDay && isLocked && !isRecoveryDay && (
            <div className="day-status locked">🔒 Missed - View Only</div>
          )}
          {isPastDay && !isLocked && !isRecoveryDay && (
            <div className="day-status completed">✅ Completed</div>
          )}
        </div>
      </div>

      {/* Progress Section - Only show for non-recovery days and not future days */}
      {!isRecoveryDay && !isFutureDay && (
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

      {/* Future Day Message */}
      {isFutureDay && !isRecoveryDay && (
        <div className="future-day-message">
          <div className="future-content">
            <h2>🔮 Future Workout</h2>
            <p>This workout will be available on {selectedDay}. Come back then to start your training!</p>
            <div className="future-preview">
              <h3>What's planned:</h3>
              <ul>
                <li>{warmupData.exercises.length} warmup exercises</li>
                <li>{dayData.exercises.length} main exercises</li>
                <li>Estimated duration: {Math.round((warmupData.exercises.length + dayData.exercises.length) * 2.5)} minutes</li>
              </ul>
            </div>
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
        ) : !isFutureDay ? (
          /* Regular Workout Content - Only show if not future day */
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
                    <div key={index} className={`exercise-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
                      <div className="exercise-checkbox-container">
                        <input
                          type="checkbox"
                          id={exerciseId}
                          className="exercise-checkbox"
                          checked={isCompleted}
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
                      <div key={index} className={`exercise-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}>
                        <div className="exercise-checkbox-container">
                          <input
                            type="checkbox"
                            id={exerciseId}
                            className="exercise-checkbox"
                            checked={isCompleted}
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
        ) : null}
      </div>
    </div>
  );
};

export default WorkoutDetailPage; 