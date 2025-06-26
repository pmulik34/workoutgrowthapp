import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import WorkoutPage from './components/WorkoutPage';
import WorkoutDetailPage from './components/WorkoutDetailPage';
import DietPage from './components/DietPage';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import BottomNavigation from './components/BottomNavigation';
import { ProgressProvider } from './components/ProgressContext';
import './App.css';

// Utility function to clear all data (for testing)
const clearAllData = () => {
  localStorage.removeItem('workoutAppData');
  localStorage.removeItem('workoutDataStore');
  localStorage.removeItem('hasCompletedSplash');
  window.location.reload();
};

// Add to window for testing (remove in production)
if (process.env.NODE_ENV === 'development') {
  window.clearAllData = clearAllData;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appData, setAppData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedData = localStorage.getItem('workoutAppData');
    const hasCompletedSplash = localStorage.getItem('hasCompletedSplash');
    
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAppData(parsedData);
      
      // If user has completed splash before, skip it
      if (hasCompletedSplash === 'true') {
        setShowSplash(false);
      } else {
        // First time user - show splash
        setShowSplash(true);
      }
    } else {
      // New user - initialize with zero progress
      const defaultData = {
        user: {
          name: '',
          age: '',
          phone: '',
          height: '',
          weight: '',
          currentStreak: 0,
          totalWorkouts: 0
        },
        preferences: {
          theme: 'dark',
          notifications: true
        },
        workoutHistory: [],
        progress: {
          currentStreak: 0,
          totalWorkouts: 0,
          thisWeekCompleted: 0,
          thisWeekTotal: 7,
          totalCaloriesBurned: 0,
          totalTimeSpent: 0,
          averageWorkoutDuration: 0,
          favoriteWorkoutType: 'None'
        }
      };
      setAppData(defaultData);
      localStorage.setItem('workoutAppData', JSON.stringify(defaultData));
    }
    
    setIsInitialized(true);
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    localStorage.setItem('hasCompletedSplash', 'true');
  };

  // Update user data (called from ProfilePage)
  const updateUserData = (userData) => {
    const updatedData = {
      ...appData,
      user: {
        ...appData.user,
        ...userData
      }
  };

    setAppData(updatedData);
    localStorage.setItem('workoutAppData', JSON.stringify(updatedData));
  };

  // Save data to localStorage whenever appData changes
  useEffect(() => {
    if (appData && isInitialized) {
      localStorage.setItem('workoutAppData', JSON.stringify(appData));
    }
  }, [appData, isInitialized]);

  // Don't render anything until initialization is complete
  if (!isInitialized) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onNext={handleSplashComplete} />;
  }

  return (
    <ProgressProvider>
    <Router>
      <div className="app">
        <div className="app-main-content">
          <Routes>
            {/* Main navigation routes */}
            <Route path="/" element={<HomeScreen userData={appData?.user} />} />
            <Route path="/workout" element={<WorkoutPage userData={appData?.user} />} />
            <Route path="/workout/:day" element={<WorkoutDetailPage />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage userData={appData?.user} onUpdateUser={updateUserData} />} />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BottomNavigation />
      </div>
    </Router>
    </ProgressProvider>
  );
}

export default App;
