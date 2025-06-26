import React from 'react';
import { useProgress } from './ProgressContext';
import './AchievementBadges.css';

const achievementData = {
  flexibilityGuru: {
    name: 'Flexibility Guru',
    description: 'Complete 30 flexibility exercises',
    icon: '🧘‍♀️',
    color: '#8b5cf6',
    requirement: 30
  },
  strengthMaster: {
    name: 'Strength Master',
    description: 'Complete 50 strength exercises',
    icon: '💪',
    color: '#ef4444',
    requirement: 50
  },
  enduranceLegend: {
    name: 'Endurance Legend',
    description: 'Complete 40 endurance exercises',
    icon: '🏃‍♂️',
    color: '#10b981',
    requirement: 40
  },
  streak7: {
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    color: '#f59e0b',
    requirement: 7
  },
  streak30: {
    name: 'Monthly Master',
    description: 'Maintain a 30-day workout streak',
    icon: '⚡',
    color: '#3b82f6',
    requirement: 30
  },
  streak100: {
    name: 'Century Champion',
    description: 'Maintain a 100-day workout streak',
    icon: '👑',
    color: '#ec4899',
    requirement: 100
  }
};

export default function AchievementBadges() {
  const { getAchievements, getCurrentStreak } = useProgress();
  const achievements = getAchievements();
  const currentStreak = getCurrentStreak();

  const getAchievementStatus = (achievementKey) => {
    const achievement = achievementData[achievementKey];
    if (!achievement) return { earned: false, progress: 0 };
    
    if (achievementKey.startsWith('streak')) {
      const requiredStreak = achievement.requirement;
      const earned = currentStreak >= requiredStreak;
      const progress = Math.min((currentStreak / requiredStreak) * 100, 100);
      return { earned, progress };
    } else {
      const earned = achievements[achievementKey]?.unlocked || false;
      const count = achievements[achievementKey]?.count || 0;
      const progress = earned ? 100 : Math.min((count / achievement.requirement) * 100, 100);
      return { earned, progress };
    }
  };

  return (
    <div className="achievement-badges-section">
      <div className="achievement-header">
        <h3 className="achievement-title">Achievements</h3>
        <div className="achievement-stats">
          <span className="current-streak">🔥 {currentStreak} Day Streak</span>
        </div>
      </div>
      
      <div className="achievement-grid">
        {Object.entries(achievementData).map(([key, achievement]) => {
          const { earned, progress } = getAchievementStatus(key);
          
          return (
            <div 
              key={key} 
              className={`achievement-card ${earned ? 'achievement-earned' : 'achievement-locked'}`}
              style={{ '--achievement-color': achievement.color }}
            >
              <div className="achievement-icon">
                {earned ? achievement.icon : '🔒'}
              </div>
              <div className="achievement-content">
                <h4 className="achievement-name">{achievement.name}</h4>
                <p className="achievement-description">{achievement.description}</p>
                {!earned && (
                  <div className="achievement-progress">
                    <div className="progress-bar-mini">
                      <div 
                        className="progress-fill-mini"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="progress-text-mini">
                      {key.startsWith('streak') ? currentStreak : (achievements[key]?.count || 0)}/{achievement.requirement}
                    </span>
                  </div>
                )}
              </div>
              {earned && (
                <div className="achievement-check">✓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 