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
      <div className="h-screen w-screen flex items-center justify-center bg-white">
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
    <div className="flex h-screen bg-white overflow-hidden text-gray-900">
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="px-6 py-4 flex items-center justify-between border-b border-gray-50 bg-white">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <Menu size={24} />
            </button>

            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              {MONTHS[currentDate.getMonth()]} <span className="text-gray-300 ml-1 font-medium">{currentDate.getFullYear()}</span>
            </h2>
            
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button onClick={prevMonth} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-emerald-600 shadow-none hover:shadow-sm"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-emerald-600">Today</button>
              <button onClick={nextMonth} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500 hover:text-emerald-600 shadow-none hover:shadow-sm"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
              <CalendarIcon size={16} />
              Create Event
            </button>
            
            <button className="p-2.5 text-gray-400 hover:text-emerald-600 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
           <MonthView currentDate={currentDate} />
        </div>
      </main>
    </div>
  );
};

export default App;