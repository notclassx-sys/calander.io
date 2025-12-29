
import React, { useState, useEffect } from 'react';
import Login from './components/Login.tsx';
import Sidebar from './components/Sidebar.tsx';
import MonthView from './components/MonthView.tsx';
import { ChevronLeft, ChevronRight, Search, Bell } from 'lucide-react';
import { MONTHS } from './constants.ts';
import { ViewType, User } from './types.ts';
import { supabase } from './services/supabaseClient.ts';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

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
    name: session.user.user_metadata?.full_name || session.user.email || 'User',
    email: session.user.email || '',
    avatar: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${session.user.email}&background=0D9488&color=fff`
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col min-w-0 bg-[#fcfdfc]">
        {/* Header */}
        <header className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-bold text-gray-900 min-w-[180px]">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm"><ChevronLeft size={18} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1 text-sm font-semibold text-gray-600 hover:text-gray-900">Today</button>
              <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg transition-all text-gray-600 shadow-sm"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-64 transition-all focus:bg-white focus:shadow-sm"
              />
            </div>
            <button className="p-2 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {(['month', 'week', 'day'] as ViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1 text-sm font-bold capitalize transition-all rounded-lg ${
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
        <div className="px-8 pb-8 flex-1 flex flex-col overflow-hidden">
           <MonthView 
            currentDate={currentDate} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;
