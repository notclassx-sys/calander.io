import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login.tsx';
import Sidebar from './components/Sidebar.tsx';
import MonthView from './components/MonthView.tsx';
import { ChevronLeft, ChevronRight, Menu, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { MONTHS } from './constants.ts';
import { User } from './types.ts';
import { supabase } from './services/supabaseClient.ts';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-100"
        >
          <CalendarIcon className="text-white" size={32} />
        </motion.div>
        <Loader2 className="animate-spin text-emerald-500" size={20} />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const user: User = {
    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    avatar: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${session.user.email}&background=10b981&color=fff`
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden text-slate-900 select-none">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
        {/* Modern Header */}
        <header className="px-6 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-5">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 text-slate-700 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-all active:bg-white"
            >
              <Menu size={24} />
            </motion.button>

            <div className="flex flex-col">
              <AnimatePresence mode="wait">
                <motion.h2 
                  key={currentDate.getMonth()}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-2xl font-extrabold tracking-tight leading-none text-slate-900"
                >
                  {MONTHS[currentDate.getMonth()]}
                </motion.h2>
              </AnimatePresence>
              <span className="text-[10px] text-emerald-600 font-black tracking-[0.2em] uppercase mt-1">
                {currentDate.getFullYear()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100 shadow-sm">
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={prevMonth} 
                className="p-2 text-slate-600 hover:text-emerald-600"
              >
                <ChevronLeft size={20} />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={goToToday} 
                className="px-4 text-[11px] font-black text-emerald-600 uppercase tracking-wider"
              >
                Month
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={nextMonth} 
                className="p-2 text-slate-600 hover:text-emerald-600"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </header>

        <motion.div 
          layout
          className="flex-1 flex flex-col overflow-hidden"
        >
           <MonthView currentDate={currentDate} />
        </motion.div>
        
        {/* Floating Add Button Concept (Hidden but UI ready) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-10 right-8 w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 z-20 md:hidden"
        >
          <span className="text-2xl font-bold">+</span>
        </motion.button>
      </main>
    </div>
  );
};

export default App;