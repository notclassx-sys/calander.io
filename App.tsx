
import React, { useState, useEffect } from 'react';
import Login from './components/Login.tsx';
import Sidebar from './components/Sidebar.tsx';
import MonthView from './components/MonthView.tsx';
import { ChevronLeft, ChevronRight, Menu, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { MONTHS } from './constants.ts';
import { ViewType, User } from './types.ts';
import { supabase } from './services/supabaseClient.ts';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  if (!session) {
    return <Login />;
  }

  const user: User = {
    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    avatar: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${session.user.email}&background=0D9488&color=fff`
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
        <header className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-gray-100 lg:border-none">
          <div className="flex items-center gap-3 md:gap-8">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white border border-gray-200 rounded-xl text-gray-600 shadow-sm active:bg-gray-50"
            >
              <Menu size={20} />
            </button>

            <h2 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
              {MONTHS[currentDate.getMonth()]} <span className="hidden sm:inline">{currentDate.getFullYear()}</span>
            </h2>
            
            <div className="flex items-center bg-gray-100 p-1 rounded-xl ml-1 md:ml-0">
              <button onClick={prevMonth} className="p-1.5 md:p-2 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-2 md:px-4 py-1 text-xs md:text-sm font-bold text-gray-600 hover:text-gray-900">Today</button>
              <button onClick={nextMonth} className="p-1.5 md:p-2 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 md:p-2.5 bg-white border border-gray-200 text-gray-400 hover:text-emerald-600 rounded-xl transition-all relative shadow-sm">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
              {(['month', 'week', 'day'] as ViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 md:px-4 py-1 text-xs md:text-sm font-bold capitalize transition-all rounded-lg ${
                    view === v ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
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
           <MonthView 
            currentDate={currentDate} 
          />
        </div>

        {/* Floating Action Button for Mobile */}
        <button className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-200 active:scale-95 transition-all">
          <CalendarIcon size={24} />
        </button>
      </main>
    </div>
  );
};

export default App;
