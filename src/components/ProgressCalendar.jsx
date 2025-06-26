import React, { useState } from 'react';
import { useProgress } from './ProgressContext';
import './ProgressCalendar.css';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProgressCalendar() {
  const { getCalendarMonth, getTodayKey } = useProgress();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const calendar = getCalendarMonth(year, month);

  // For grid alignment
  const firstDay = new Date(year, month, 1).getDay();

  // Handlers for month navigation
  const prevMonth = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else {
      setMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear(y => y + 1);
      setMonth(0);
    } else {
      setMonth(m => m + 1);
    }
  };

  return (
    <div className="progress-calendar-section">
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav">◀</button>
        <span className="calendar-title">
          {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
        </span>
        <button onClick={nextMonth} className="calendar-nav">▶</button>
      </div>
      <div className="calendar-grid">
        {dayNames.map((d) => (
          <div key={d} className="calendar-day-name">{d}</div>
        ))}
        {/* Empty cells for first week offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={'empty-' + i} className="calendar-empty"></div>
        ))}
        {calendar.map((day, idx) => (
          <div
            key={day.date}
            className={`calendar-cell calendar-${day.status} ${day.date === getTodayKey() ? 'calendar-today' : ''}`}
            title={day.date}
          >
            <span className="calendar-date">{parseInt(day.date.slice(-2), 10)}</span>
            <span className="calendar-status">
              {day.status === 'done' ? '✅' : day.status === 'missed' ? '❌' : '💤'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 