
import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, Settings, LayoutGrid, LogOut, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient.ts';

interface SidebarProps {
  user?: { name: string; avatar: string };
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white z-50 p-6 flex flex-col border-r border-gray-100
        sidebar-transition lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-100">
              <CalendarIcon className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Calendar.io</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 mb-8">
          <NavItem icon={<LayoutGrid size={20} />} label="Overview" active onClick={onClose} />
          <NavItem icon={<Users size={20} />} label="Team" onClick={onClose} />
          <NavItem icon={<Clock size={20} />} label="Tasks" onClick={onClose} />
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={onClose} />
        </nav>

        {/* Mini Calendar Mock - Hidden on small mobile to save space */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 mt-4 hidden sm:block">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">March 2024</span>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
            {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] text-gray-600">
            {Array.from({ length: 31 }).map((_, i) => (
              <span key={i} className={`p-1 rounded-md ${i + 1 === 14 ? 'bg-emerald-600 text-white font-bold' : ''}`}>
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200 border-2 border-emerald-50" />
            <div className="flex-1 flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate block">{user?.name}</span>
              <span className="text-xs text-gray-400">Free Plan</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-500 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
