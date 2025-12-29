import React, { useState } from 'react';
import { Calendar, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseClient.ts';

const Login: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Login Error:', err);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-60" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-8 flex flex-col justify-center items-center text-center relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 mb-10"
        >
          <Calendar className="text-white" size={40} />
        </motion.div>
        
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tighter leading-none mb-4">
          Calendar<span className="text-emerald-600">.io</span>
        </h1>
        
        <div className="h-1 w-12 bg-emerald-200 rounded-full mb-6 mx-auto" />
        
        <p className="text-slate-500 max-w-xs text-lg font-medium leading-relaxed">
          The cleanest way to manage your time and tasks.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 pb-16 flex flex-col items-center relative z-10"
      >
        <div className="w-full max-w-sm space-y-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className={`w-full flex items-center justify-center gap-4 py-5 px-6 rounded-[2rem] bg-emerald-600 text-white font-bold transition-all shadow-xl shadow-emerald-100 ${isLoggingIn ? 'opacity-70' : ''}`}
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 48 48">
                <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
              </svg>
            )}
            <span className="text-xl">{isLoggingIn ? 'Connecting...' : 'Continue with Google'}</span>
          </motion.button>
          
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Secure Login</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;