import React from 'react';
import { DAYS } from '../constants.ts';

interface MonthViewProps {
  currentDate: Date;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const calendarDays = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
  }
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
  }

  return (
    <div className="flex-1 flex flex-col bg-white border-t border-l border-gray-400 overflow-hidden">
      {/* Weekday Header - High Contrast */}
      <div className="grid grid-cols-7 border-b border-gray-400 bg-emerald-50/30">
        {DAYS.map(day => (
          <div key={day} className="py-2.5 text-center text-[11px] font-bold text-gray-700 uppercase border-r border-gray-400 last:border-r-0">
            {day.charAt(0)}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid - Sharp Borders for APK clarity */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarDays.map((item, idx) => {
          const isToday = item.date.toDateString() === new Date().toDateString();
          return (
            <div
              key={idx}
              className={`relative border-r border-b border-gray-400 flex items-center justify-center transition-colors ${
                !item.currentMonth ? 'bg-gray-100' : 'bg-white active:bg-emerald-50'
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <span className={`text-sm md:text-base font-bold w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                isToday 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : item.currentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;