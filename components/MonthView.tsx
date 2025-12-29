import React from 'react';
import { motion } from 'framer-motion';
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.005
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden p-2 lg:p-4">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {day.charAt(0)}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        key={currentDate.toISOString()} // Force re-animation on month change
        className="grid grid-cols-7 flex-1 gap-1"
      >
        {calendarDays.map((item, idx) => {
          const isToday = item.date.toDateString() === new Date().toDateString();
          return (
            <motion.div
              variants={itemAnim}
              key={idx}
              className={`relative rounded-2xl flex items-center justify-center transition-colors overflow-hidden group ${
                !item.currentMonth ? 'bg-slate-50/50' : 'bg-white border border-slate-100 hover:border-emerald-200'
              }`}
            >
              <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-emerald-500' : 'opacity-0'}`} />
              
              <span className={`text-sm md:text-base font-bold transition-all ${
                isToday 
                  ? 'text-emerald-600' 
                  : item.currentMonth ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {item.day}
              </span>
              
              {item.currentMonth && (
                <div className="absolute inset-0 bg-emerald-600/0 active:bg-emerald-600/5 transition-colors pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default MonthView;