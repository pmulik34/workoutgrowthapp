import React, { useState } from 'react';
import { useProgress } from './ProgressContext';
import DailyProgressBar from './DailyProgressBar';
import ProgressCalendar from './ProgressCalendar';
import AchievementBadges from './AchievementBadges';
import './ProgressPage.css';

export default function ProgressPage() {
  const { getTimeBasedProgress } = useProgress();
  const [timeFrame, setTimeFrame] = useState('today');
  
  const timeFrameData = getTimeBasedProgress(timeFrame);
  
  const timeFrameOptions = [
    { key: 'today', label: 'Today', icon: '🌞' },
    { key: 'week', label: 'This Week', icon: '📅' },
    { key: 'month', label: 'This Month', icon: '📊' }
  ];

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'var(--accent-green)';
    if (percentage >= 60) return 'var(--accent-blue)';
    if (percentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getTimeFrameStats = () => {
    const total = timeFrameData.total;
    const completed = timeFrameData.completed;
    let percentage = 0;
    if (timeFrame === 'today') {
      percentage = total > 0 ? (completed / total) * 100 : 0;
    } else {
      percentage = total > 0 ? (completed / total) * 100 : 0;
    }
    return {
      total,
      completed,
      percentage: Math.round(percentage),
      color: getProgressColor(percentage)
    };
  };

  const stats = getTimeFrameStats();

  const getStatLabels = () => {
    if (timeFrame === 'today') {
      return {
        completed: 'Exercises Completed',
        total: 'Total Exercises',
        rate: 'Completion Rate',
        progressText: `${stats.completed} of ${stats.total} exercises completed`
      };
    } else {
      return {
        completed: 'Workout Days Completed',
        total: 'Total Workout Days',
        rate: 'Completion Rate',
        progressText: `${stats.completed} of ${stats.total} workout days completed`
      };
    }
  };

  const labels = getStatLabels();

  return (
    <div className="progress-page">
      <div className="progress-page-header">
        <h1 className="progress-page-title">Progress Tracker</h1>
        <p className="progress-page-subtitle">Track your fitness journey and celebrate achievements</p>
      </div>

      {/* Daily Progress Bar */}
      <DailyProgressBar />

      {/* Time-based Progress Tracking */}
      <div className="time-progress-section">
        <div className="time-progress-header">
          <h3 className="time-progress-title">Progress Overview</h3>
          <div className="time-frame-selector">
            {timeFrameOptions.map((option) => (
              <button
                key={option.key}
                className={`time-frame-btn ${timeFrame === option.key ? 'active' : ''}`}
                onClick={() => setTimeFrame(option.key)}
              >
                <span className="time-frame-icon">{option.icon}</span>
                <span className="time-frame-label">{option.label}</span>
              </button>
            ))}
          </div>
            </div>

        <div className="time-progress-content">
          <div className="time-progress-stats">
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
                <h4 className="stat-value">{stats.completed}</h4>
                <p className="stat-label">{labels.completed}</p>
        </div>
      </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h4 className="stat-value">{stats.total}</h4>
                <p className="stat-label">{labels.total}</p>
          </div>
        </div>
        
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h4 className="stat-value" style={{ color: stats.color }}>
                  {stats.percentage}%
                </h4>
                <p className="stat-label">{labels.rate}</p>
              </div>
        </div>
      </div>

          {stats.total > 0 && (
            <div className="time-progress-bar-container">
              <div className="time-progress-bar">
                      <div 
                  className="time-progress-fill"
                  style={{ 
                    width: `${stats.percentage}%`,
                    backgroundColor: stats.color
                  }}
                />
                    </div>
              <div className="time-progress-text">
                {labels.progressText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Calendar */}
      <ProgressCalendar />

      {/* Achievement Badges */}
      <AchievementBadges />

      {/* Progress Tips */}
      <div className="progress-tips-section">
        <h3 className="progress-tips-title">💡 Progress Tips</h3>
        <div className="progress-tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🔥</div>
            <h4 className="tip-title">Maintain Your Streak</h4>
            <p className="tip-description">Consistency is key! Try to work out at least 3-4 times per week to build momentum.</p>
            </div>
          
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4 className="tip-title">Set Realistic Goals</h4>
            <p className="tip-description">Start with achievable targets and gradually increase intensity as you progress.</p>
          </div>
          
          <div className="tip-card">
            <div className="tip-icon">📈</div>
            <h4 className="tip-title">Track Your Progress</h4>
            <p className="tip-description">Use this calendar to visualize your consistency and celebrate your achievements.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 