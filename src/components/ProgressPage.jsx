import React, { useState, useEffect } from 'react';
import './ProgressPage.css';

const ProgressPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutProgress, setWorkoutProgress] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  // Load workout progress from localStorage
  useEffect(() => {
    loadWorkoutProgress();
  }, []);

  const loadWorkoutProgress = () => {
    const workoutDataStore = JSON.parse(localStorage.getItem('workoutDataStore')) || {};
    
    setWorkoutProgress(workoutDataStore.weeklyProgress || {});
    setCurrentStreak(workoutDataStore.statistics?.currentStreak || 0);
    setTotalWorkouts(workoutDataStore.statistics?.totalWorkouts || 0);
  };

  // Get current week info for the given date
  const getWeekInfo = (date) => {
    const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayDate = new Date(date);
    
    // Calculate Monday of that week
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Handle Sunday as 0
    mondayDate.setDate(date.getDate() + diff);
    
    const weekId = `week_${mondayDate.getFullYear()}_${mondayDate.getMonth()}_${mondayDate.getDate()}`;
    
    return { weekId, mondayDate };
  };

  // Calculate if a workout day is completed
  const isWorkoutCompleted = (day, date) => {
    const workoutDataStore = JSON.parse(localStorage.getItem('workoutDataStore')) || {};
    const { weekId } = getWeekInfo(date);
    const dayCompletionKey = `${weekId}_${day}`;
    
    return workoutDataStore.completionHistory?.[dayCompletionKey]?.completed || false;
  };

  // Get current month calendar data
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const current = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(current);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const isCurrentMonth = date.getMonth() === month;
        const isToday = date.toDateString() === new Date().toDateString();
        const isPast = date < new Date().setHours(0, 0, 0, 0);
        
        // Only check completion for workout days (Mon-Fri)
        const isWorkoutDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayName);
        const isCompleted = isWorkoutDay ? isWorkoutCompleted(dayName, date) : false;
        const isRecoveryDay = ['Saturday', 'Sunday'].includes(dayName);
        
        weekDays.push({
          date: date.getDate(),
          fullDate: new Date(date),
          dayName,
          isCurrentMonth,
          isToday,
          isPast,
          isWorkoutDay,
          isRecoveryDay,
          isCompleted
        });
        
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    
    return calendar;
  };

  // Calculate statistics
  const calculateStats = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let monthlyWorkouts = 0;
    let completedWorkouts = 0;
    let weeklyData = [0, 0, 0, 0]; // 4 weeks
    
    // Calculate for current month
    for (let day = 1; day <= new Date(currentYear, currentMonth + 1, 0).getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayName)) {
        monthlyWorkouts++;
        if (date <= today && isWorkoutCompleted(dayName, date)) {
          completedWorkouts++;
          const weekIndex = Math.floor((day - 1) / 7);
          if (weekIndex < 4) weeklyData[weekIndex]++;
        }
      }
    }
    
    const completionRate = monthlyWorkouts > 0 ? Math.round((completedWorkouts / monthlyWorkouts) * 100) : 0;
    
    return {
      monthlyWorkouts,
      completedWorkouts,
      completionRate,
      weeklyData
    };
  };

  // Navigation functions
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const stats = calculateStats();
  const calendarData = getCalendarData();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Achievement system
  const getAchievements = () => {
    const achievements = [];
    
    if (currentStreak >= 7) achievements.push({ name: '7 Day Streak', icon: '🔥', achieved: true });
    if (currentStreak >= 14) achievements.push({ name: '2 Week Warrior', icon: '💪', achieved: true });
    if (currentStreak >= 30) achievements.push({ name: 'Monthly Master', icon: '👑', achieved: true });
    if (totalWorkouts >= 50) achievements.push({ name: '50 Workouts', icon: '🏆', achieved: true });
    if (stats.completionRate >= 80) achievements.push({ name: '80% Completion', icon: '⭐', achieved: true });
    
    return achievements;
  };

  return (
    <div className="progress-page">
      {/* Header */}
      <div className="progress-header">
        <h1>Your Progress</h1>
        <p className="progress-tagline">Track your fitness journey</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card streak">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{currentStreak}</h3>
            <p>Day Streak</p>
          </div>
        </div>
        
        <div className="stat-card total">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <h3>{totalWorkouts}</h3>
            <p>Total Workouts</p>
          </div>
        </div>
        
        <div className="stat-card completion">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.completionRate}%</h3>
            <p>This Month</p>
          </div>
        </div>
        
        <div className="stat-card monthly">
          <div className="stat-icon">🗓️</div>
          <div className="stat-content">
            <h3>{stats.completedWorkouts}/{stats.monthlyWorkouts}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <div className="calendar-section">
        <div className="calendar-header">
          <button className="nav-btn" onClick={() => navigateMonth(-1)}>‹</button>
          <h2>{monthName}</h2>
          <button className="nav-btn" onClick={() => navigateMonth(1)}>›</button>
        </div>
        
        <div className="calendar-grid">
          {/* Day headers */}
          <div className="calendar-day-headers">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="calendar-days">
            {calendarData.map((week, weekIndex) => 
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`calendar-day ${
                    !day.isCurrentMonth ? 'other-month' :
                    day.isToday ? 'today' :
                    day.isRecoveryDay ? 'recovery-day' :
                    day.isWorkoutDay && day.isCompleted ? 'completed' :
                    day.isWorkoutDay && day.isPast ? 'missed' :
                    day.isWorkoutDay ? 'workout-day' : ''
                  }`}
                >
                  <span className="day-number">{day.date}</span>
                  {day.isWorkoutDay && day.isCompleted && (
                    <div className="completion-indicator">✓</div>
                  )}
                  {day.isWorkoutDay && day.isPast && !day.isCompleted && (
                    <div className="missed-indicator">✗</div>
                  )}
                  {day.isRecoveryDay && (
                    <div className="recovery-indicator">😌</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Legend */}
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color completed"></div>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color missed"></div>
            <span>Missed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color recovery-day"></div>
            <span>Recovery</span>
          </div>
          <div className="legend-item">
            <div className="legend-color workout-day"></div>
            <span>Scheduled</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {getAchievements().map((achievement, index) => (
            <div key={index} className="achievement-card achieved">
              <div className="achievement-icon">{achievement.icon}</div>
              <h3>{achievement.name}</h3>
            </div>
          ))}
          
          {/* Locked achievements */}
          {currentStreak < 7 && (
            <div className="achievement-card locked">
              <div className="achievement-icon">🔒</div>
              <h3>7 Day Streak</h3>
            </div>
          )}
          {totalWorkouts < 50 && (
            <div className="achievement-card locked">
              <div className="achievement-icon">🔒</div>
              <h3>50 Workouts</h3>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="weekly-chart-section">
        <h2>Weekly Progress</h2>
        <div className="chart-container">
          {stats.weeklyData.map((count, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ height: `${(count / 5) * 100}%` }}
              ></div>
              <span className="bar-label">Week {index + 1}</span>
              <span className="bar-count">{count}/5</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 