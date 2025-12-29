import React, { useState, useEffect } from 'react';
import Login from './components/Login.tsx';
import Sidebar from './components/Sidebar.tsx';
import MonthView from './components/MonthView.tsx';
import { ChevronLeft, ChevronRight, Menu, Loader2 } from 'lucide-react';
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
      <div className="h-full w-full flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
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
        {/* Mobile App Header */}
        <header className="px-4 py-4 flex items-center justify-between border-b-2 border-gray-400 bg-white shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-700 active:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex flex-col">
              <h2 className="text-lg font-extrabold tracking-tight leading-none text-emerald-700">
                {MONTHS[currentDate.getMonth()]}
              </h2>
              <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">
                {currentDate.getFullYear()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-0.5 border border-gray-300">
              <button onClick={prevMonth} className="p-2 text-gray-700 active:scale-90 transition-transform"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-black text-emerald-700">TODAY</button>
              <button onClick={nextMonth} className="p-2 text-gray-700 active:scale-90 transition-transform"><ChevronRight size={20} /></button>
            </div>
          </div>
        </header>

        {/* Content Area - Dark Borders in MonthView */}
        <div className="flex-1 flex flex-col overflow-hidden">
           <MonthView currentDate={currentDate} />
        </div>
        
        {/* Simple Mobile Bottom Bar Feel (Empty but reserves space) */}
        <footer className="h-4 bg-gray-100 border-t border-gray-400 sm:hidden"></footer>
      </main>
    </div>
  );
};

export default App;