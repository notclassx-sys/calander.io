
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

  // Previous month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
  }
  // Next month filler
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
  }

  return (
    <div className="flex-1 overflow-auto bg-white rounded-t-3xl border-t border-l border-gray-100">
      <div className="grid grid-cols-7 border-b border-gray-100 sticky top-0 bg-white z-10">
        {DAYS.map(day => (
          <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-full min-h-[600px]">
        {calendarDays.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`min-h-[120px] p-2 border-r border-b border-gray-50 transition-colors ${!item.currentMonth ? 'bg-gray-50/50' : 'hover:bg-emerald-50/20'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  item.date.toDateString() === new Date().toDateString() 
                    ? 'bg-emerald-600 text-white' 
                    : item.currentMonth ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {item.day}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
