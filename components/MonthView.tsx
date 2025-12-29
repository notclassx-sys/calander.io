
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
    <div className="flex-1 flex flex-col bg-white rounded-t-3xl border-t border-l border-gray-100 overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
        {DAYS.map(day => (
          <div key={day} className="py-2 md:py-4 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
            {/* Show only first letter on very small screens */}
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarDays.map((item, idx) => {
          const isToday = item.date.toDateString() === new Date().toDateString();
          return (
            <div
              key={idx}
              className={`p-1 md:p-2 border-r border-b border-gray-50 flex flex-col transition-colors ${!item.currentMonth ? 'bg-gray-50/30' : 'hover:bg-emerald-50/30'}`}
            >
              <div className="flex justify-center sm:justify-start mb-1">
                <span className={`text-xs md:text-sm font-bold w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all ${
                  isToday 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                    : item.currentMonth ? 'text-gray-700' : 'text-gray-300'
                }`}>
                  {item.day}
                </span>
              </div>
              {/* Event indicators for mobile */}
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {item.currentMonth && Math.random() > 0.8 && (
                   <div className="h-1 w-1 md:h-1.5 md:w-1.5 bg-emerald-400 rounded-full mx-auto sm:mx-0 mt-auto mb-1"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
