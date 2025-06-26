import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// --- CONSTANTS ---
const STORAGE_KEY = 'workoutProgressDataV2';
const WORKOUT_DAYS = [1, 2, 3, 4, 5]; // Mon-Fri (0=Sun)
const REST_DAYS = [0, 6]; // Sun, Sat
const FLEXIBILITY_DAY = 3; // Wednesday (0=Sun)

// --- HELPERS ---
function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}
function isRestDay(date) {
  const day = date.getDay();
  return REST_DAYS.includes(day);
}
function isWorkoutDay(date) {
  const day = date.getDay();
  return WORKOUT_DAYS.includes(day);
}
function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday as start
  d.setHours(0,0,0,0);
  return d;
}

// --- CONTEXT ---
const ProgressContext = createContext();
export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  // --- STATE ---
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      byDate: {}, // { 'YYYY-MM-DD': { exercises: {exerciseId: boolean}, total: N, completed: N, status: 'done'|'missed'|'rest' } }
      streaks: { current: 0, highest: 0, past: [] },
      achievements: {},
      strengthCount: 0,
      enduranceCount: 0,
      flexibilityCount: 0,
      yearly: 0,
      monthly: 0,
      weekly: 0,
    };
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // --- MARK EXERCISE AS DONE (NEW INTERFACE) ---
  const markExerciseAsDone = useCallback((dateKey, exerciseId, isDone) => {
    setProgress(prev => {
      const prevDay = prev.byDate[dateKey] || { 
        exercises: {}, 
        total: 0, 
        completed: 0, 
        status: isRestDay(new Date(dateKey)) ? 'rest' : 'missed' 
      };
      
      const newExercises = { ...prevDay.exercises };
      newExercises[exerciseId] = isDone;
      
      const completedCount = Object.values(newExercises).filter(Boolean).length;
      const totalCount = Object.keys(newExercises).length;
      
      let status = isRestDay(new Date(dateKey)) ? 'rest' : 
                   (totalCount > 0 && completedCount === totalCount) ? 'done' : 'missed';
      
      // Update streaks
      let streaks = { ...prev.streaks };
      if (status === 'done' && isWorkoutDay(new Date(dateKey))) {
        if (dateKey === getTodayKey()) {
          streaks.current++;
          if (streaks.current > streaks.highest) streaks.highest = streaks.current;
        }
      }
      
      // Update achievements
      let achievements = { ...prev.achievements };
      if (status === 'done' && !achievements.firstStep) {
        achievements.firstStep = { unlocked: true, date: dateKey };
      }
      
      // Flexibility Guru (30 flexibility exercises)
      if (status === 'done' && new Date(dateKey).getDay() === FLEXIBILITY_DAY) {
        let flexCount = achievements.flexibilityGuru?.count || 0;
        flexCount++;
        if (flexCount >= 30) {
          achievements.flexibilityGuru = { unlocked: true, date: dateKey };
        } else {
          achievements.flexibilityGuru = { count: flexCount };
        }
      }
      
      // Strength Master (50 strength exercises)
      if (status === 'done' && new Date(dateKey).getDay() === 1) { // Monday
        let strengthCount = achievements.strengthMaster?.count || 0;
        strengthCount++;
        if (strengthCount >= 50) {
          achievements.strengthMaster = { unlocked: true, date: dateKey };
        } else {
          achievements.strengthMaster = { count: strengthCount };
        }
      }
      
      // Endurance Legend (40 endurance exercises)
      if (status === 'done' && new Date(dateKey).getDay() === 2) { // Tuesday
        let enduranceCount = achievements.enduranceLegend?.count || 0;
        enduranceCount++;
        if (enduranceCount >= 40) {
          achievements.enduranceLegend = { unlocked: true, date: dateKey };
        } else {
          achievements.enduranceLegend = { count: enduranceCount };
        }
      }
      
      return {
        ...prev,
        byDate: {
          ...prev.byDate,
          [dateKey]: {
            exercises: newExercises,
            total: totalCount,
            completed: completedCount,
            status
          }
        },
        streaks,
        achievements
      };
    });
  }, []);

  // --- INITIALIZE EXERCISES FOR A DAY ---
  const initializeExercisesForDay = useCallback((dateKey, exerciseIds) => {
    setProgress(prev => {
      const prevDay = prev.byDate[dateKey] || { 
        exercises: {}, 
        total: 0, 
        completed: 0, 
        status: isRestDay(new Date(dateKey)) ? 'rest' : 'missed' 
      };
      
      const newExercises = { ...prevDay.exercises };
      
      // Initialize all exercises as not done
      exerciseIds.forEach(exerciseId => {
        if (!(exerciseId in newExercises)) {
          newExercises[exerciseId] = false;
        }
      });
      
      const completedCount = Object.values(newExercises).filter(Boolean).length;
      const totalCount = Object.keys(newExercises).length;
      
      return {
        ...prev,
        byDate: {
          ...prev.byDate,
          [dateKey]: {
            exercises: newExercises,
            total: totalCount,
            completed: completedCount,
            status: isRestDay(new Date(dateKey)) ? 'rest' : 'missed'
          }
        }
      };
    });
  }, []);

  // --- GET TODAY'S PROGRESS ---
  const getTodayProgress = useCallback(() => {
    const todayKey = getTodayKey();
    const todayData = progress.byDate[todayKey] || { exercises: {}, total: 0, completed: 0 };
    return {
      exercises: todayData.exercises || {},
      total: todayData.total || 0,
      completed: todayData.completed || 0
    };
  }, [progress.byDate]);

  // --- GET DAY PROGRESS ---
  const getDayProgress = useCallback((dateKey) => {
    const dayData = progress.byDate[dateKey] || { exercises: {}, total: 0, completed: 0 };
    return {
      exercises: dayData.exercises || {},
      total: dayData.total || 0,
      completed: dayData.completed || 0
    };
  }, [progress.byDate]);

  // --- GET TIME-BASED PROGRESS ---
  const getTimeBasedProgress = useCallback((timeFrame) => {
    const today = new Date();
    
    if (timeFrame === 'today') {
      const todayKey = getTodayKey(today);
      const todayData = progress.byDate[todayKey] || { total: 0, completed: 0 };
      return { total: todayData.total || 0, completed: todayData.completed || 0 };
    }
    
    let startDate, endDate;
    
    if (timeFrame === 'week') {
      startDate = getWeekStart(today);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    } else if (timeFrame === 'month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (timeFrame === 'year') {
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
    } else {
      // Default to today if unknown timeframe
      const todayKey = getTodayKey(today);
      const todayData = progress.byDate[todayKey] || { total: 0, completed: 0 };
      return { total: todayData.total || 0, completed: todayData.completed || 0 };
    }
    
    let totalWorkoutDays = 0;
    let completedWorkoutDays = 0;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = getTodayKey(d);
      const dayData = progress.byDate[dateKey];
      
      if (isWorkoutDay(d)) {
        totalWorkoutDays++;
        // Check if this workout day is completed (all exercises done)
        if (dayData && dayData.status === 'done') {
          completedWorkoutDays++;
        }
      }
    }
    
    return { total: totalWorkoutDays, completed: completedWorkoutDays };
  }, [progress.byDate]);

  // --- GET ACHIEVEMENTS ---
  const getAchievements = useCallback(() => {
    return progress.achievements || {};
  }, [progress.achievements]);

  // --- GET CURRENT STREAK ---
  const getCurrentStreak = useCallback(() => {
    return progress.streaks?.current || 0;
  }, [progress.streaks]);

  // --- CALENDAR LOGIC ---
  const getCalendarMonth = useCallback((year, month) => {
    const days = getMonthDays(year, month);
    const calendar = [];
    for (let d = 1; d <= days; d++) {
      const date = new Date(year, month, d);
      const key = getTodayKey(date);
      const isRest = isRestDay(date);
      const dayData = progress.byDate[key] || {};
      calendar.push({
        date: key,
        status: isRest ? 'rest' : (dayData.status || 'missed'),
        completed: dayData.completed || 0,
        total: dayData.total || 0
      });
    }
    return calendar;
  }, [progress.byDate]);

  // --- PROVIDER VALUE ---
  const value = {
    progress,
    markExerciseAsDone,
    initializeExercisesForDay,
    getTodayProgress,
    getTodayKey,
    getDayProgress,
    getTimeBasedProgress,
    getAchievements,
    getCurrentStreak,
    getCalendarMonth,
    clearProgressData: () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    },
    clearAllData: () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('workoutAppData');
      localStorage.removeItem('hasCompletedSplash');
      window.location.reload();
    }
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}; 