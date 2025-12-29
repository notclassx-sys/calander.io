import React, { useState, useEffect } from 'react';
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

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white">
        <div className="w-20 h-20 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-emerald-100 animate-bounce">
          <CalendarIcon className="text-white" size={32} />
        </div>
        <Loader2 className="animate-spin text-emerald-500" size={24} />
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
    <div className="flex h-full w-full bg-white overflow-hidden text-gray-900 select-none">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
        {/* APK Optimized Header */}
        <header className="px-4 py-5 flex items-center justify-between border-b-4 border-emerald-500/5 bg-white z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-800 active:bg-gray-100 rounded-2xl transition-all"
            >
              <Menu size={28} />
            </button>

            <div className="flex flex-col">
              <h2 className="text-xl font-black tracking-tight leading-none text-emerald-700">
                {MONTHS[currentDate.getMonth()]}
              </h2>
              <span className="text-[10px] text-gray-400 font-black tracking-[0.3em] uppercase">
                {currentDate.getFullYear()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-50 rounded-2xl p-1 border-2 border-gray-100 shadow-inner">
              <button onClick={prevMonth} className="p-2 text-gray-800 active:scale-75 transition-transform"><ChevronLeft size={22} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 text-[10px] font-black text-emerald-600">TODAY</button>
              <button onClick={nextMonth} className="p-2 text-gray-800 active:scale-75 transition-transform"><ChevronRight size={22} /></button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
           <MonthView currentDate={currentDate} />
        </div>
        
        {/* Native Safe Area reserve */}
        <footer className="h-6 bg-white sm:hidden border-t border-gray-100"></footer>
      </main>
    </div>
  );
};

export default App;