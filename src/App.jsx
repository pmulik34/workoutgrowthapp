import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import WorkoutPage from './components/WorkoutPage';
import WorkoutDetailPage from './components/WorkoutDetailPage';
import DietPage from './components/DietPage';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appData, setAppData] = useState(null);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedData = localStorage.getItem('workoutAppData');
    if (savedData) {
      setAppData(JSON.parse(savedData));
    } else {
      // Initialize with default data
      const defaultData = {
        user: {
          name: 'John Doe',
          currentStreak: 0,
          totalWorkouts: 0
        },
        preferences: {
          theme: 'dark',
          notifications: true
        },
        workoutHistory: []
      };
      setAppData(defaultData);
      localStorage.setItem('workoutAppData', JSON.stringify(defaultData));
    }
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Save data to localStorage whenever appData changes
  useEffect(() => {
    if (appData) {
      localStorage.setItem('workoutAppData', JSON.stringify(appData));
    }
  }, [appData]);

  if (showSplash) {
    return <SplashScreen onNext={handleSplashComplete} />;
  }

  return (
    <Router>
      <div className="app">
        <div className="app-main-content">
          <Routes>
            {/* Main navigation routes */}
            <Route path="/" element={<Navigate to="/workout" replace />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/workout/:day" element={<WorkoutDetailPage />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Catch all route - redirect to workout */}
            <Route path="*" element={<Navigate to="/workout" replace />} />
          </Routes>
        </div>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
