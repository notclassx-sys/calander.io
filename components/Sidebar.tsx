import React from 'react';
import { Calendar as CalendarIcon, Clock, Users, Settings, LogOut, X } from 'lucide-react';
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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-white z-50 p-6 flex flex-col border-r-2 border-gray-400
        sidebar-transition lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <CalendarIcon className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">CALENDAR.IO</span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 active:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 mb-8">
          <NavItem icon={<CalendarIcon size={24} />} label="My Calendar" active onClick={onClose} />
          <NavItem icon={<Clock size={24} />} label="Daily Tasks" onClick={onClose} />
          <NavItem icon={<Users size={24} />} label="Team Groups" onClick={onClose} />
          <NavItem icon={<Settings size={24} />} label="Settings" onClick={onClose} />
        </nav>

        <div className="mt-auto pt-6 border-t-2 border-gray-100">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <img src={user?.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-sm" />
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">{user?.name}</span>
              <span className="text-xs text-gray-500 font-medium">Standard User</span>
            </div>
            <button onClick={handleLogout} className="p-3 text-gray-400 hover:text-rose-500 active:bg-rose-50 rounded-xl transition-all">
              <LogOut size={20} />
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
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all active:scale-[0.97] ${
      active ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-100' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="text-base">{label}</span>
  </button>
);

export default Sidebar;