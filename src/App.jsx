import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import WorkoutPage from './components/WorkoutPage';
import DietPage from './components/DietPage';
import ProgressPage from './components/ProgressPage';
import ProfilePage from './components/ProfilePage';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('workout');
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
          name: 'Imran',
          currentStreak: 0,
          totalWorkouts: 0
        },
        preferences: {
          theme: 'dark',
          notifications: true
        },
        workoutHistory: [],
        currentTab: 'workout'
      };
      setAppData(defaultData);
      localStorage.setItem('workoutAppData', JSON.stringify(defaultData));
    }
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Save current tab to localStorage
    if (appData) {
      const updatedData = {
        ...appData,
        currentTab: tabId
      };
      setAppData(updatedData);
      localStorage.setItem('workoutAppData', JSON.stringify(updatedData));
    }
  };

  // Save data to localStorage whenever appData changes
  useEffect(() => {
    if (appData) {
      localStorage.setItem('workoutAppData', JSON.stringify(appData));
    }
  }, [appData]);

  // Load saved tab on app start
  useEffect(() => {
    if (appData && appData.currentTab) {
      setActiveTab(appData.currentTab);
    }
  }, [appData]);

  // Render current page based on active tab
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'workout':
        return <WorkoutPage />;
      case 'diet':
        return <DietPage />;
      case 'progress':
        return <ProgressPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <WorkoutPage />;
    }
  };

  if (showSplash) {
    return <SplashScreen onNext={handleSplashComplete} />;
  }

  return (
    <div className="app">
      <div className="app-main-content">
        {renderCurrentPage()}
      </div>
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
}

export default App;
