import React, { useEffect } from 'react';
import { useProgress } from './ProgressContext';
import './DailyProgressBar.css';

export default function DailyProgressBar() {
  const { getTodayProgress, getTodayKey } = useProgress();
  const todayProgress = getTodayProgress();
  const todayKey = getTodayKey();
  
  // Debug logging
  useEffect(() => {
    console.log('DailyProgressBar - todayProgress:', todayProgress);
    console.log('DailyProgressBar - todayKey:', todayKey);
  }, [todayProgress, todayKey]);
  
  const totalExercises = todayProgress.total;
  const completedExercises = todayProgress.completed;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  
  const getProgressColor = () => {
    if (progressPercentage === 100) return 'var(--accent-green)';
    if (progressPercentage >= 50) return 'var(--accent-blue)';
    return '#ef4444';
  };

  const getProgressText = () => {
    if (totalExercises === 0) return 'No workout scheduled for today';
    if (progressPercentage === 100) return 'Workout completed! 🎉';
    if (completedExercises === 0) return 'Ready to start your workout!';
    return `${completedExercises}/${totalExercises} exercises completed`;
  };

  const getProgressEmoji = () => {
    if (progressPercentage === 100) return '🏆';
    if (progressPercentage >= 75) return '💪';
    if (progressPercentage >= 50) return '🔥';
    if (progressPercentage >= 25) return '⚡';
    return '🚀';
  };

  return (
    <div className="daily-progress-section">
      <div className="progress-header">
        <h3 className="progress-title">Today's Progress</h3>
        <span className="progress-date">{todayKey}</span>
      </div>
      
      <div className="progress-content">
        <div className="progress-stats">
          <div className="progress-emoji">{getProgressEmoji()}</div>
          <div className="progress-text">
            <p className="progress-status">{getProgressText()}</p>
            {totalExercises > 0 && (
              <p className="progress-percentage">{Math.round(progressPercentage)}% Complete</p>
            )}
          </div>
        </div>
        
        {totalExercises > 0 && (
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>
            <div className="progress-numbers">
              <span>{completedExercises}</span>
              <span>/</span>
              <span>{totalExercises}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 