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

  // Get current week info with proper date handling
  const getCurrentWeekInfo = () => {
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Calculate Monday of current week
    const mondayDate = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday as 0
    mondayDate.setDate(today.getDate() + daysFromMonday);
    
    const weekId = `week_${mondayDate.getFullYear()}_${mondayDate.getMonth()}_${mondayDate.getDate()}`;
    
    // Use consistent date formatting
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayKey = `${year}-${month}-${day}`;
    
    console.log('getCurrentWeekInfo - today key:', todayKey);
    
    return {
      weekId,
      mondayDate: mondayDate.toISOString().split('T')[0],
      today: todayKey,
      currentDayName
    };
  };

  // Initialize comprehensive workout storage
  const initializeWorkoutStorage = () => {
    const { weekId, mondayDate, today, currentDayName } = getCurrentWeekInfo();
    let workoutStorage = JSON.parse(localStorage.getItem('workoutAppStorage')) || {};
    
    // Ensure all required properties exist
    if (!workoutStorage.currentWeek) {
      workoutStorage.currentWeek = weekId;
    }
    
    if (!workoutStorage.weekStartDate) {
      workoutStorage.weekStartDate = mondayDate;
    }
    
    if (!workoutStorage.dailyProgress) {
      workoutStorage.dailyProgress = {};
    }
    
    if (!workoutStorage.weeklyStats) {
      workoutStorage.weeklyStats = {
        totalWorkouts: 5, // Monday to Friday
        completedWorkouts: 0,
        weekProgress: 0,
        lastUpdated: today
      };
    }
    
    if (!workoutStorage.overallStats) {
      workoutStorage.overallStats = {
        totalWeeksCompleted: 0,
        totalWorkoutsEver: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }
    
    // Check if we need to start a new week
    if (workoutStorage.currentWeek !== weekId) {
      console.log('New week detected, resetting workout data');
      
      // Reset for new week but keep historical stats
      const preservedOverallStats = workoutStorage.overallStats;
      
      workoutStorage = {
        currentWeek: weekId,
        weekStartDate: mondayDate,
        lastUpdated: today,
        dailyProgress: {}, // Reset all daily progress
        weeklyStats: {
          totalWorkouts: 5, // Monday to Friday
          completedWorkouts: 0,
          weekProgress: 0,
          lastUpdated: today
        },
        overallStats: preservedOverallStats
      };
    }
    
    // Update last accessed date
    workoutStorage.lastUpdated = today;
    
    localStorage.setItem('workoutAppStorage', JSON.stringify(workoutStorage));
    return workoutStorage;
  };

  // Get or create daily progress entry
  const getDayProgressKey = (dayName) => {
    // Get the current week's Monday
    const today = new Date();
    const mondayDate = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday as 0
    mondayDate.setDate(today.getDate() + daysFromMonday);
    
    // Calculate the specific day within this week
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayName);
    const specificDate = new Date(mondayDate);
    specificDate.setDate(mondayDate.getDate() + dayIndex);
    
    // Use consistent date formatting for the specific day
    const year = specificDate.getFullYear();
    const month = String(specificDate.getMonth() + 1).padStart(2, '0');
    const day = String(specificDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const progressKey = `${dateKey}_${dayName}`;
    
    console.log('Generated progress key for', dayName, ':', progressKey);
    return progressKey;
  };

  // Force save data to localStorage immediately
  const forceSaveProgress = (exerciseSet) => {
    try {
      const workoutStorage = JSON.parse(localStorage.getItem('workoutAppStorage')) || {};
      const dayProgressKey = getDayProgressKey(selectedDay);
      const totalExercises = calculateTotalExercises(selectedDay);
      const completedCount = exerciseSet.size;
      const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
      const isCompleted = totalExercises > 0 && completedCount === totalExercises;

      console.log('=== FORCE SAVE DATA ===');
      console.log('Saving for day:', selectedDay);
      console.log('Using save key:', dayProgressKey);
      console.log('Exercise set size:', exerciseSet.size);
      console.log('Exercise set:', [...exerciseSet]);

      if (totalExercises > 0) {
        // Ensure dailyProgress object exists
        if (!workoutStorage.dailyProgress) {
          workoutStorage.dailyProgress = {};
        }

        workoutStorage.dailyProgress[dayProgressKey] = {
          dayName: selectedDay,
          date: getCurrentWeekInfo().today,
          totalExercises,
          completedExercises: completedCount,
          progress: progressPercentage,
          checkedExercises: [...exerciseSet],
          isCompleted,
          completedDate: isCompleted ? new Date().toISOString() : null,
          lastUpdated: new Date().toISOString()
        };

        updateWeeklyStats(workoutStorage);
        localStorage.setItem('workoutAppStorage', JSON.stringify(workoutStorage));
        
        console.log('Force save completed successfully');
        console.log('Saved data:', workoutStorage.dailyProgress[dayProgressKey]);
        
        // Immediate verification
        const verifyData = JSON.parse(localStorage.getItem('workoutAppStorage'));
        if (verifyData.dailyProgress[dayProgressKey]) {
          console.log('Force save verification passed');
        } else {
          console.error('Force save verification FAILED');
        }
      }
    } catch (error) {
      console.error('Error in forceSaveProgress:', error);
    }
  };

  // Calculate total exercises for a day
  const calculateTotalExercises = (dayName) => {
    const dayData = workoutData[dayName];
    if (dayData?.type === 'recovery') return 0;
    
    const warmupData = workoutData.Warmup;
    return (warmupData?.exercises?.length || 0) + (dayData?.exercises?.length || 0);
  };

  // Check if user can interact with this day's workout
  const checkDayAccessibility = () => {
    const { currentDayName } = getCurrentWeekInfo();
    
    // Recovery days are always accessible (but no checkboxes anyway)
    if (workoutData[selectedDay]?.type === 'recovery') {
      return true;
    }
    
    // Only current day is fully interactive
    return selectedDay === currentDayName ? 'interactive' : 'view-only';
  };

  // Load saved progress from localStorage
  useEffect(() => {
    if (selectedDay) {
      try {
        const workoutStorage = initializeWorkoutStorage();
        const dayProgressKey = getDayProgressKey(selectedDay);
        
        console.log('=== LOADING DATA ===');
        console.log('Loading progress for day:', selectedDay);
        console.log('Looking for key:', dayProgressKey);
        console.log('Available keys in storage:', Object.keys(workoutStorage.dailyProgress || {}));
        console.log('Full dailyProgress object:', workoutStorage.dailyProgress);
        
        // Load saved exercises for this day
        const dayProgress = workoutStorage.dailyProgress[dayProgressKey];
        console.log('Found dayProgress:', dayProgress);
        
        if (dayProgress && dayProgress.checkedExercises && Array.isArray(dayProgress.checkedExercises)) {
          console.log('Loading checked exercises:', dayProgress.checkedExercises);
          const savedExercises = new Set(dayProgress.checkedExercises);
          console.log('Setting completed exercises to:', [...savedExercises]);
          setCompletedExercises(savedExercises);
        } else {
          console.log('No saved progress found, starting fresh');
          setCompletedExercises(new Set());
        }
        
        // Check accessibility
        const accessibility = checkDayAccessibility();
        setIsLocked(accessibility === 'view-only');
      } catch (error) {
        console.error('Error loading workout data:', error);
        // Reset to default state on error
        setCompletedExercises(new Set());
        setIsLocked(checkDayAccessibility() === 'view-only');
      }
    }
  }, [selectedDay]);

  // Save progress whenever completedExercises changes
  useEffect(() => {
    if (selectedDay && completedExercises.size >= 0) {
      try {
        const workoutStorage = initializeWorkoutStorage();
        const dayProgressKey = getDayProgressKey(selectedDay);
        const totalExercises = calculateTotalExercises(selectedDay);
        const completedCount = completedExercises.size;
        const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
        const isCompleted = totalExercises > 0 && completedCount === totalExercises;
        
        // Only save if there are exercises to track
        if (totalExercises > 0) {
          // Ensure dailyProgress exists
          if (!workoutStorage.dailyProgress) {
            workoutStorage.dailyProgress = {};
          }
          
          // Update daily progress
          workoutStorage.dailyProgress[dayProgressKey] = {
            dayName: selectedDay,
            date: getCurrentWeekInfo().today,
            totalExercises,
            completedExercises: completedCount,
            progress: progressPercentage,
            checkedExercises: [...completedExercises],
            isCompleted,
            completedDate: isCompleted ? new Date().toISOString() : null,
            lastUpdated: new Date().toISOString()
          };
          
          // Update weekly stats
          updateWeeklyStats(workoutStorage);
          
          // Save to localStorage
          localStorage.setItem('workoutAppStorage', JSON.stringify(workoutStorage));
          
          console.log('=== AUTOMATIC SAVE ===');
          console.log('Progress saved:', {
            day: selectedDay,
            key: dayProgressKey,
            completed: completedCount,
            total: totalExercises,
            percentage: progressPercentage,
            checkedExercises: [...completedExercises]
          });
          
          // Immediately verify the save
          const verification = JSON.parse(localStorage.getItem('workoutAppStorage'));
          if (verification.dailyProgress[dayProgressKey]) {
            console.log('Save verified successfully');
          } else {
            console.error('Save verification failed!');
          }
        }
      } catch (error) {
        console.error('Error saving workout data:', error);
      }
    }
  }, [completedExercises, selectedDay]);

  // Also save when component unmounts (before navigation)
  useEffect(() => {
    return () => {
      if (selectedDay && completedExercises.size >= 0) {
        try {
          const workoutStorage = JSON.parse(localStorage.getItem('workoutAppStorage')) || {};
          const dayProgressKey = getDayProgressKey(selectedDay);
          const totalExercises = calculateTotalExercises(selectedDay);
          
          if (totalExercises > 0 && workoutStorage.dailyProgress) {
            workoutStorage.dailyProgress[dayProgressKey] = {
              ...workoutStorage.dailyProgress[dayProgressKey],
              checkedExercises: [...completedExercises],
              completedExercises: completedExercises.size,
              progress: Math.round((completedExercises.size / totalExercises) * 100),
              lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('workoutAppStorage', JSON.stringify(workoutStorage));
            console.log('Data saved on unmount for:', selectedDay);
          }
        } catch (error) {
          console.error('Error saving data on unmount:', error);
        }
      }
    };
  }, [selectedDay, completedExercises]);

  // Update weekly statistics
  const updateWeeklyStats = (workoutStorage) => {
    // Ensure workoutStorage and required objects exist
    if (!workoutStorage) {
      console.error('workoutStorage is undefined');
      return;
    }
    
    if (!workoutStorage.dailyProgress) {
      workoutStorage.dailyProgress = {};
    }
    
    if (!workoutStorage.weeklyStats) {
      workoutStorage.weeklyStats = {
        totalWorkouts: 5,
        completedWorkouts: 0,
        weekProgress: 0,
        lastUpdated: new Date().toISOString()
      };
    }
    
    if (!workoutStorage.overallStats) {
      workoutStorage.overallStats = {
        totalWeeksCompleted: 0,
        totalWorkoutsEver: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }
    
    const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let completedWorkouts = 0;
    let totalProgress = 0;
    
    workoutDays.forEach(dayName => {
      const dayProgressKey = getDayProgressKey(dayName);
      const dayProgress = workoutStorage.dailyProgress[dayProgressKey];
      
      if (dayProgress) {
        if (dayProgress.isCompleted) {
          completedWorkouts++;
        }
        totalProgress += dayProgress.progress || 0;
      }
    });
    
    // Safely update weekly stats
    const previousCompletedWorkouts = workoutStorage.weeklyStats.completedWorkouts || 0;
    
    workoutStorage.weeklyStats = {
      totalWorkouts: workoutDays.length,
      completedWorkouts,
      weekProgress: Math.round(totalProgress / workoutDays.length),
      lastUpdated: new Date().toISOString()
    };
    
    // Update overall stats if week is completed
    if (completedWorkouts === workoutDays.length && previousCompletedWorkouts < workoutDays.length) {
      workoutStorage.overallStats.totalWeeksCompleted = (workoutStorage.overallStats.totalWeeksCompleted || 0) + 1;
      workoutStorage.overallStats.currentStreak = (workoutStorage.overallStats.currentStreak || 0) + 1;
      workoutStorage.overallStats.longestStreak = Math.max(
        workoutStorage.overallStats.longestStreak || 0,
        workoutStorage.overallStats.currentStreak || 0
      );
    }
    
    // Safely update total workouts
    const workoutDifference = completedWorkouts - previousCompletedWorkouts;
    if (workoutDifference > 0) {
      workoutStorage.overallStats.totalWorkoutsEver = (workoutStorage.overallStats.totalWorkoutsEver || 0) + workoutDifference;
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
  const totalExercises = isRecoveryDay ? 0 : calculateTotalExercises(selectedDay);
  const completedCount = completedExercises.size;
  const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  // Toggle exercise completion (only if not locked)
  const toggleExerciseCompletion = (exerciseId) => {
    if (isLocked) return; 
    
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      const wasChecked = newSet.has(exerciseId);
      
      if (wasChecked) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      
      console.log('=== EXERCISE TOGGLE ===');
      console.log('Exercise ID:', exerciseId);
      console.log('Was checked:', wasChecked);
      console.log('Now checked:', newSet.has(exerciseId));
      console.log('Total checked:', newSet.size);
      console.log('All checked exercises:', [...newSet]);
      
      // Immediately save to localStorage with the new set
      forceSaveProgress(newSet);
      
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
    return reps || '1min';
  };

  // Check if today or future day
  const { currentDayName } = getCurrentWeekInfo();
  const workoutDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayIndex = workoutDays.indexOf(currentDayName);
  const selectedDayIndex = workoutDays.indexOf(selectedDay);
  const isFutureDay = selectedDayIndex > todayIndex;
  const isPastDay = selectedDayIndex < todayIndex;
  const isToday = selectedDayIndex === todayIndex;

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
            <div className="day-status future">🔮 Future Workout - View Only</div>
          )}
          {isPastDay && !isRecoveryDay && (
            <div className="day-status locked">🔒 Past Workout - View Only</div>
          )}
          {isToday && !isRecoveryDay && (
            <div className="day-status today">⚡ Today's Workout</div>
          )}
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
          /* Regular Workout Content - Always show, but lock interaction for non-today */
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
            {dayData && dayData.exercises && dayData.exercises.length > 0 && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailPage; 