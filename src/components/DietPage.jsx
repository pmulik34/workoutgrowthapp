import React from 'react';
import './DietPage.css';

const DietPage = ({ userData }) => {
  // Get user's first name or use default greeting
  const getGreeting = () => {
    if (userData && userData.name && userData.name.trim()) {
      const firstName = userData.name.trim().split(' ')[0];
      return `Power Up, ${firstName}! 🥗`;
    }
    return 'Power Up, Warrior! 🥗';
  };

  // Anime-themed meal categories
  const mealCategories = [
    {
      id: 'breakfast',
      name: 'Dawn Power',
      icon: '🌅',
      description: 'Fuel your morning training',
      color: 'var(--accent-orange)',
      meals: [
        { name: 'Hero\'s Oatmeal Bowl', calories: 350, protein: '12g', carbs: '45g', fat: '8g' },
        { name: 'Ninja Protein Smoothie', calories: 280, protein: '25g', carbs: '30g', fat: '5g' },
        { name: 'Warrior\'s Egg Scramble', calories: 320, protein: '20g', carbs: '15g', fat: '18g' }
      ]
    },
    {
      id: 'lunch',
      name: 'Midday Energy',
      icon: '⚡',
      description: 'Recharge for afternoon battles',
      color: 'var(--accent-green)',
      meals: [
        { name: 'Dragon\'s Chicken Bowl', calories: 450, protein: '35g', carbs: '40g', fat: '15g' },
        { name: 'Samurai Salmon Salad', calories: 380, protein: '28g', carbs: '25g', fat: '20g' },
        { name: 'Legendary Quinoa Bowl', calories: 420, protein: '18g', carbs: '55g', fat: '12g' }
      ]
    },
    {
      id: 'dinner',
      name: 'Evening Recovery',
      icon: '🌙',
      description: 'Restore and rebuild',
      color: 'var(--accent-purple)',
      meals: [
        { name: 'Phoenix Grilled Fish', calories: 380, protein: '32g', carbs: '20g', fat: '18g' },
        { name: 'Mystic Turkey Stir-Fry', calories: 420, protein: '30g', carbs: '35g', fat: '16g' },
        { name: 'Celestial Veggie Pasta', calories: 400, protein: '15g', carbs: '50g', fat: '14g' }
      ]
    },
    {
      id: 'snacks',
      name: 'Power Snacks',
      icon: '💪',
      description: 'Quick energy boosts',
      color: 'var(--accent-pink)',
      meals: [
        { name: 'Energy Orb Nuts', calories: 180, protein: '8g', carbs: '12g', fat: '14g' },
        { name: 'Protein Bar of Power', calories: 220, protein: '20g', carbs: '18g', fat: '8g' },
        { name: 'Fruit of the Gods', calories: 120, protein: '2g', carbs: '25g', fat: '1g' }
      ]
    }
  ];

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

  return (
    <div className="diet-page">
      {/* Greeting Section */}
      <div className="greeting-section">
        <h1>{getGreeting()}</h1>
        <p className="tagline">Fuel your body with the power of champions!</p>
        <div className="anime-quote">
          <p>"Your body is a temple. Treat it like one."</p>
          <span className="quote-author">- Ancient Warrior Wisdom</span>
        </div>
      </div>

      {/* Nutrition Stats */}
      <div className="nutrition-stats">
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
      </div>

      {/* Meal Categories */}
      <div className="meal-categories">
        <h2>Power Nutrition Guide</h2>
        <div className="categories-grid">
          {mealCategories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </div>
              
              <div className="meals-list">
                {category.meals.map((meal, index) => (
                  <div key={index} className="meal-item">
                    <div className="meal-info">
                      <h4>{meal.name}</h4>
                      <div className="meal-macros">
                        <span className="macro">{meal.calories} cal</span>
                        <span className="macro">{meal.protein} protein</span>
                        <span className="macro">{meal.carbs} carbs</span>
                        <span className="macro">{meal.fat} fat</span>
                      </div>
                    </div>
                    <button className="add-meal-btn anime-btn">
                      <span className="btn-text">ADD</span>
                      <span className="btn-icon">+</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration Reminder */}
      <div className="hydration-section">
        <div className="hydration-card">
          <div className="hydration-icon">💧</div>
          <div className="hydration-content">
            <h3>Stay Hydrated, Warrior!</h3>
            <p>Drink 8-10 glasses of water daily to maintain peak performance</p>
            <div className="water-tracker">
              <div className="water-glasses">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="water-glass">
                    <span className="glass-icon">🥤</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPage; 