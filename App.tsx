import React, { useState, useEffect } from 'react';
import Login from './components/Login.tsx';
import Sidebar from './components/Sidebar.tsx';
import MonthView from './components/MonthView.tsx';
import { ChevronLeft, ChevronRight, Menu, Bell, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { MONTHS } from './constants.ts';
import { ViewType, User } from './types.ts';
import { supabase } from './services/supabaseClient.ts';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Listen for changes on auth state (logged in, signed out, etc.)
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
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
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
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#fcfdfc] relative">
        {/* Header */}
        <header className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-gray-100 lg:border-none bg-white lg:bg-transparent">
          <div className="flex items-center gap-3 md:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white border border-gray-200 rounded-xl text-gray-600 shadow-sm active:bg-gray-50 transition-colors"
            >
              <Menu size={20} />
            </button>

            <h2 className="text-lg md:text-2xl font-bold text-gray-900 truncate tracking-tight">
              {MONTHS[currentDate.getMonth()]} <span className="text-gray-400 font-medium ml-1">{currentDate.getFullYear()}</span>
            </h2>
            
            <div className="flex items-center bg-gray-100 p-1 rounded-xl ml-1 md:ml-0 border border-gray-200/50">
              <button onClick={prevMonth} className="p-1.5 md:p-2 hover:bg-white rounded-lg transition-all text-gray-600 hover:text-emerald-600 shadow-none hover:shadow-sm"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-2 md:px-4 py-1 text-xs md:text-sm font-semibold text-gray-600 hover:text-emerald-700">Today</button>
              <button onClick={nextMonth} className="p-1.5 md:p-2 hover:bg-white rounded-lg transition-all text-gray-600 hover:text-emerald-600 shadow-none hover:shadow-sm"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 md:p-2.5 bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 rounded-xl transition-all relative shadow-sm group">
              <Bell size={18} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl border border-gray-200/50">
              {(['month', 'week', 'day'] as ViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 md:px-4 py-1 text-xs md:text-sm font-bold capitalize transition-all rounded-lg ${
                    view === v ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100/20' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Calendar Main */}
        <div className="px-4 md:px-8 pb-4 md:pb-8 flex-1 flex flex-col overflow-hidden">
           <MonthView currentDate={currentDate} />
        </div>

        {/* Floating Action Button for Mobile */}
        <button className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-200 active:scale-90 transition-all z-30">
          <CalendarIcon size={24} />
        </button>
      </main>
    </div>
  );
};

export default App;