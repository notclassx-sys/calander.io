import React from 'react';
import { Calendar as CalendarIcon, LogOut, X, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`
          fixed inset-y-0 left-0 w-80 bg-white z-50 p-8 flex flex-col border-r border-slate-100
          lg:relative lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <CalendarIcon className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Calendar.io</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 active:bg-slate-50 rounded-full lg:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-3">
          <NavItem icon={<LayoutGrid size={22} />} label="My Calendar" active onClick={onClose} />
        </nav>

        <div className="mt-auto pt-8">
          <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-3xl border border-emerald-100">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover" 
            />
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">{user?.name}</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Pro Account</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-2.5 text-slate-400 hover:text-rose-500 active:bg-white rounded-xl transition-all shadow-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
      active 
        ? 'bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-100' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span className="text-base">{label}</span>
  </motion.button>
);

export default Sidebar;