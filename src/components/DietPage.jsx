import React, { useState, useEffect } from 'react';
import './DietPage.css';

const DietPage = ({ userData }) => {
  // Hydration tracking state
  const [hydrationData, setHydrationData] = useState({
    currentDay: 0,
    weeklyData: {}
  });

  // Accordion state for tip categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle accordion category
  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `GlowUp, ${firstName}! ✨`;
    }
    return 'GlowUp, Warrior! ✨';
  };

  // Initialize hydration tracking
  useEffect(() => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('hydrationData');
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      // Check if it's a new day
      if (parsedData.currentDay !== today) {
        // Save yesterday's data to weekly data
        const updatedWeeklyData = {
          ...parsedData.weeklyData,
          [parsedData.currentDay]: parsedData.currentGlasses || 0
        };
        
        // Keep only last 7 days
        const weeklyKeys = Object.keys(updatedWeeklyData);
        if (weeklyKeys.length > 7) {
          const oldestDay = weeklyKeys[0];
          delete updatedWeeklyData[oldestDay];
        }
        
        setHydrationData({
          currentDay: today,
          currentGlasses: 0,
          weeklyData: updatedWeeklyData
        });
        
        localStorage.setItem('hydrationData', JSON.stringify({
          currentDay: today,
          currentGlasses: 0,
          weeklyData: updatedWeeklyData
        }));
      } else {
        setHydrationData(parsedData);
      }
    } else {
      // First time user
      setHydrationData({
        currentDay: today,
        currentGlasses: 0,
        weeklyData: {}
      });
      localStorage.setItem('hydrationData', JSON.stringify({
        currentDay: today,
        currentGlasses: 0,
        weeklyData: {}
      }));
    }
  }, []);

  // Handle glass click
  const handleGlassClick = (index) => {
    const today = new Date().toDateString();
    const currentGlasses = hydrationData.currentGlasses || 0;
    
    if (index < currentGlasses) {
      // Unmark glass
      const newGlasses = currentGlasses - 1;
      const updatedData = {
        ...hydrationData,
        currentGlasses: newGlasses
      };
      setHydrationData(updatedData);
      localStorage.setItem('hydrationData', JSON.stringify(updatedData));
    } else if (index === currentGlasses) {
      // Mark next glass (no limit)
      const newGlasses = currentGlasses + 1;
      const updatedData = {
        ...hydrationData,
        currentGlasses: newGlasses
      };
      setHydrationData(updatedData);
      localStorage.setItem('hydrationData', JSON.stringify(updatedData));
    }
  };

  // Get weekly average
  const getWeeklyAverage = () => {
    const values = Object.values(hydrationData.weeklyData || {});
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  };

  // Get today's progress percentage (based on 8 glass goal)
  const getTodayProgress = () => {
    const current = hydrationData.currentGlasses || 0;
    return Math.min(Math.round((current / 8) * 100), 100);
  };

  // Get goal status
  const getGoalStatus = () => {
    const current = hydrationData.currentGlasses || 0;
    if (current >= 8) return 'goal-achieved';
    if (current >= 6) return 'goal-close';
    if (current >= 4) return 'goal-progress';
    return 'goal-start';
  };

  // Get user stats (mock data for now)
  const getUserStats = () => {
    return {
      dailyCalories: userData?.dailyCalories || 2000,
      proteinGoal: userData?.proteinGoal || 150,
      carbsGoal: userData?.carbsGoal || 200,
      fatGoal: userData?.fatGoal || 65
    };
  };

  const stats = getUserStats();
  const currentGlasses = hydrationData.currentGlasses || 0;
  const weeklyAverage = getWeeklyAverage();
  const todayProgress = getTodayProgress();
  const goalStatus = getGoalStatus();

  return (
    <div className="diet-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Fuel your body with the power of champions!</p>
        <div className="anime-quote">
          <p>"Your body is a temple. Treat it like one."</p>
        </div>
      </div>

      {/* Nutrition Stats */}
      {/* <div className="nutrition-stats">
        <h2>Today's Power Goals</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.dailyCalories}</div>
              <div className="stat-label">Calories</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-value">{stats.proteinGoal}g</div>
              <div className="stat-label">Protein</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{stats.carbsGoal}g</div>
              <div className="stat-label">Carbs</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-content">
              <div className="stat-value">{stats.fatGoal}g</div>
              <div className="stat-label">Healthy Fats</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Hydration Reminder */}
      <div className="hydration-section">
        <div className="hydration-card">
          <div className="hydration-icon">💧</div>
          <div className="hydration-content">
            <h3>Stay Hydrated, Warrior!</h3>
            <p>Drink 8-10 glasses of water daily to maintain peak performance</p>
            
            {/* Progress Display */}
            <div className="hydration-progress">
              <div className="progress-info">
                <span className="progress-text">Today: {currentGlasses} glasses</span>
                <span className={`progress-percentage ${goalStatus}`}>
                  {currentGlasses >= 8 ? 'Goal Achieved! 🎉' : `${todayProgress}%`}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${goalStatus}`} 
                  style={{ width: `${todayProgress}%` }}
                ></div>
              </div>
              <div className="goal-status">
                <span className={`status-text ${goalStatus}`}>
                  {currentGlasses >= 8 ? 'Excellent! Keep going!' : 
                   currentGlasses >= 6 ? 'Almost there! 2 more to go!' :
                   currentGlasses >= 4 ? 'Good progress! Halfway there!' :
                   'Keep drinking water, Warrior!'}
                </span>
              </div>
            </div>
            
            {/* Weekly Stats */}
            <div className="weekly-stats">
              <div className="stat-item">
                <span className="stat-label">Weekly Avg</span>
                <span className="stat-value">{weeklyAverage}/8</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Days Tracked</span>
                <span className="stat-value">{Object.keys(hydrationData.weeklyData || {}).length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Goal Streak</span>
                <span className="stat-value">
                  {Object.values(hydrationData.weeklyData || {}).filter(glasses => glasses >= 8).length}
                </span>
              </div>
            </div>
            
            <div className="water-tracker">
              <div className="water-glasses">
                {[...Array(12)].map((_, index) => (
                  <div 
                    key={index} 
                    className={`water-glass ${index < currentGlasses ? 'filled' : ''} ${index >= 8 ? 'bonus' : ''}`}
                    onClick={() => handleGlassClick(index)}
                  >
                    <span className="glass-icon">🥤</span>
                    {index >= 8 && <span className="bonus-label">+</span>}
                  </div>
                ))}
              </div>
              <p className="tracker-hint">
                {currentGlasses >= 8 ? 
                  'Goal achieved! Click more glasses to track extra hydration!' : 
                  'Click glasses as you drink water! Goal: 8 glasses daily'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Power Routine Section */}
      <div className="power-routine-section">
        <div className="routine-header">
          <h2>💥 Power Routine (Daily)</h2>
          <p className="routine-subtitle">Fuel your growth with this proven nutrition schedule!</p>
        </div>
        
        <div className="routine-timeline">
          {/* Pre-Workout */}
          <div className="routine-item">
            <div className="routine-time">
              <div className="time-icon">🔋</div>
              <span className="time-label">Pre-Workout</span>
            </div>
            <div className="routine-content">
              <div className="meal-description">
                <h4>1 banana + 2 egg whites</h4>
                <p>Perfect pre-workout fuel for energy and protein</p>
              </div>
            </div>
          </div>

          {/* Post-Workout */}
          <div className="routine-item">
            <div className="routine-time">
              <div className="time-icon">🏋️</div>
              <span className="time-label">Post-Workout</span>
            </div>
            <div className="routine-content">
              <div className="meal-description">
                <h4>1 banana + 2 egg whites</h4>
                <p>Recovery fuel to rebuild and grow muscles</p>
              </div>
            </div>
          </div>

          {/* Before Sleep */}
          <div className="routine-item">
            <div className="routine-time">
              <div className="time-icon">🌙</div>
              <span className="time-label">Before Sleep</span>
            </div>
            <div className="routine-content">
              <div className="meal-description">
                <h4>1 glass warm milk</h4>
                <p>+ half tablespoon turmeric for better sleep and recovery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="routine-benefits">
          <div className="benefits-header">
            <h3>🎯 Benefits of This Routine</h3>
          </div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🦴</div>
              <span className="benefit-text">Stronger Bones</span>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💪</div>
              <span className="benefit-text">Lean Muscle</span>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📏</div>
              <span className="benefit-text">Height Gains</span>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <span className="benefit-text">Better Recovery</span>
            </div>
          </div>
          <div className="routine-motivation">
            <p>"Do this consistently for stronger bones, lean muscle, and better height gains!"</p>
          </div>
        </div>
      </div>

      {/* Tricks & Tips Section */}
      <div className="tips-section">
        <h2>🔥 GLOW-UP TIPS FOR TEEN GUYS</h2>
        <p className="tips-subtitle">Essential wisdom for your journey to becoming the best version of yourself!</p>
        
        {/* Fitness & Nutrition Tips */}
        <div className="tip-category">
          <div 
            className={`category-header-accordion ${expandedCategories.nutrition ? 'expanded' : ''}`}
            onClick={() => toggleCategory('nutrition')}
          >
            <h3 className="category-title">💪 Fitness & Nutrition</h3>
            <span className="accordion-icon">{expandedCategories.nutrition ? '−' : '+'}</span>
          </div>
          <div className={`category-content ${expandedCategories.nutrition ? 'expanded' : ''}`}>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🍳</div>
                <div className="tip-content">
                  <h4>Eat Like an Athlete</h4>
                  <p>Focus on high-protein meals (eggs, chana, paneer, curd, milk), complex carbs (rice, roti, potatoes), and good fats (nuts, ghee, seeds).</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📈</div>
                <div className="tip-content">
                  <h4>Puberty Growth Boosters</h4>
                  <p>Add 1 spoon of ghee with rice/lunch to support hormones.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">💧</div>
                <div className="tip-content">
                  <h4>Hydrate Like a Ritual</h4>
                  <p>2.5–3L of water daily. Add lemon or mint for glow and digestion.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">😴</div>
                <div className="tip-content">
                  <h4>Sleep is Your Cheat Code</h4>
                  <p>Deep sleep = growth hormone boost. Aim for 7.5–9 hours.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🚫</div>
                <div className="tip-content">
                  <h4>Avoid Junk Bulk</h4>
                  <p>Maggi, chips, soft drinks = acne + bloating. Save those for 1–2 cheat meals a month.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Looks & Style Tips */}
        <div className="tip-category">
          <div 
            className={`category-header-accordion ${expandedCategories.looks ? 'expanded' : ''}`}
            onClick={() => toggleCategory('looks')}
          >
            <h3 className="category-title">😎 Looks & Style</h3>
            <span className="accordion-icon">{expandedCategories.looks ? '−' : '+'}</span>
          </div>
          <div className={`category-content ${expandedCategories.looks ? 'expanded' : ''}`}>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">💇‍♂️</div>
                <div className="tip-content">
                  <h4>Trim, Don't Just Grow</h4>
                  <p>Keep a clean hairstyle that suits your face. Trim regularly.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🧴</div>
                <div className="tip-content">
                  <h4>Skincare Basics Win</h4>
                  <p>Wash face 2x/day. For acne: try multani mitti + neem face mask once a week.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">👕</div>
                <div className="tip-content">
                  <h4>Dress Sharp, Not Loud</h4>
                  <p>Well-fitted jeans + plain tees &gt; loud logos. Add sneakers &amp; light perfume for polish.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">😊</div>
                <div className="tip-content">
                  <h4>Smile is 80% of Charm</h4>
                  <p>Brush twice, tongue clean, hydrate lips. Keep that smile fresh.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mindset & Puberty Tips */}
        <div className="tip-category">
          <div 
            className={`category-header-accordion ${expandedCategories.mindset ? 'expanded' : ''}`}
            onClick={() => toggleCategory('mindset')}
          >
            <h3 className="category-title">🧠 Mindset & Puberty</h3>
            <span className="accordion-icon">{expandedCategories.mindset ? '−' : '+'}</span>
          </div>
          <div className={`category-content ${expandedCategories.mindset ? 'expanded' : ''}`}>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🎯</div>
                <div className="tip-content">
                  <h4>Don't Chase Validation</h4>
                  <p>Focus on improving, not impressing.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📱</div>
                <div className="tip-content">
                  <h4>Social Media ≠ Real Life</h4>
                  <p>Avoid comparing. You're still leveling up.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🤝</div>
                <div className="tip-content">
                  <h4>Respect &gt; Coolness</h4>
                  <p>Be kind, own mistakes, show up for people — that's alpha.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">💭</div>
                <div className="tip-content">
                  <h4>Your Self-Talk Shapes Confidence</h4>
                  <p>Instead of "I can't," say "I'm getting better."</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Tips */}
        <div className="tip-category">
          <div 
            className={`category-header-accordion ${expandedCategories.communication ? 'expanded' : ''}`}
            onClick={() => toggleCategory('communication')}
          >
            <h3 className="category-title">🗣️ Communication & Swag</h3>
            <span className="accordion-icon">{expandedCategories.communication ? '−' : '+'}</span>
          </div>
          <div className={`category-content ${expandedCategories.communication ? 'expanded' : ''}`}>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🎭</div>
                <div className="tip-content">
                  <h4>Be Real, Not Funny</h4>
                  <p>Don't try to be funny — try to be real. Honesty builds confidence.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">👁️</div>
                <div className="tip-content">
                  <h4>Talk Slow, Look in Eye</h4>
                  <p>Talk slow, look people in the eye. That's natural dominance.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📛</div>
                <div className="tip-content">
                  <h4>Say Names</h4>
                  <p>"Hey bro" is fine, but "Hey John" lands better.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">👂</div>
                <div className="tip-content">
                  <h4>Listen Well</h4>
                  <p>Don't interrupt, listen well. It makes you seem more mature.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">📖</div>
                <div className="tip-content">
                  <h4>Read Quotes Aloud</h4>
                  <p>Read 1 quote aloud daily. It boosts vocal confidence & clarity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Tips */}
        <div className="tip-category">
          <div 
            className={`category-header-accordion ${expandedCategories.extras ? 'expanded' : ''}`}
            onClick={() => toggleCategory('extras')}
          >
            <h3 className="category-title">🚀 Extra Tips (Mental & Emotional Boosters)</h3>
            <span className="accordion-icon">{expandedCategories.extras ? '−' : '+'}</span>
          </div>
          <div className={`category-content ${expandedCategories.extras ? 'expanded' : ''}`}>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">📝</div>
                <div className="tip-content">
                  <h4>Start Journaling at Night</h4>
                  <p>Write 3 things you did well, 1 thing you'll improve.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">⚡</div>
                <div className="tip-content">
                  <h4>Avoid Dopamine Traps</h4>
                  <p>Keep your energy for real life. It shows in your eyes.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🚿</div>
                <div className="tip-content">
                  <h4>Cold Showers After Workouts</h4>
                  <p>Cold showers after workouts = testosterone + clarity.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">👨‍🏫</div>
                <div className="tip-content">
                  <h4>Have a Mentor Mindset</h4>
                  <p>Always try to help younger friends.</p>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🙏</div>
                <div className="tip-content">
                  <h4>Gratitude + Vision = Peace + Drive</h4>
                  <p>Know what you have, and where you're going.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation Quote */}
        <div className="motivation-quote">
          <div className="quote-content">
            <p>"If you do the basics consistently, you'll be years ahead of others by 20."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPage; 