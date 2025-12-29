
import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, Settings, Plus, LayoutGrid, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface SidebarProps {
  user?: { name: string; avatar: string };
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-72 border-r border-gray-100 bg-white h-full flex flex-col p-6 hidden lg:flex">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
          <CalendarIcon className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">Calendar.io</span>
      </div>

      <nav className="space-y-2 mb-8">
        <NavItem icon={<LayoutGrid size={20} />} label="Overview" active />
        <NavItem icon={<Users size={20} />} label="Team" />
        <NavItem icon={<Clock size={20} />} label="Tasks" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>

      {/* Mini Calendar Mock */}
      <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 mt-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-700">March 2024</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-white rounded transition-colors text-gray-500"><ChevronLeft size={14} /></button>
            <button className="p-1 hover:bg-white rounded transition-colors text-gray-500"><ChevronRight size={14} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-gray-600">
          {Array.from({ length: 31 }).map((_, i) => (
            <span key={i} className={`p-1 cursor-pointer hover:bg-emerald-600 hover:text-white rounded-md transition-colors ${i + 1 === 14 ? 'bg-emerald-600 text-white' : ''}`}>
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <img src={user?.avatar || "https://picsum.photos/40/40"} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200 border-2 border-emerald-100" />
          <div className="flex-1 flex-col min-w-0">
            <span className="text-sm font-bold text-gray-900 truncate">{user?.name || "Guest User"}</span>
            <span className="text-xs text-gray-500">Free Plan</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </a>
);

export default Sidebar;
