import React, { useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient.ts';

const Login: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // redirectTo: window.location.origin, // Removed for better APK compatibility
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
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Brand Header */}
      <div className="flex-1 bg-emerald-50 p-10 flex flex-col justify-center items-center text-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-200 animate-pulse">
            <Calendar className="text-white" size={32} />
          </div>
        </div>
        
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-6">
          CALENDAR<br/><span className="text-emerald-600">.IO</span>
        </h1>
        <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">
          Native Mobile Experience
        </p>
      </div>

      {/* Login Area */}
      <div className="p-10 pb-16 bg-white flex flex-col items-center border-t-4 border-emerald-500/10">
        <div className="w-full max-w-sm">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className={`w-full flex items-center justify-center gap-4 py-5 px-6 border-2 border-gray-900 rounded-3xl bg-white text-gray-900 font-black transition-all active:scale-[0.95] shadow-[8px_8px_0px_0px_rgba(16,185,129,0.1)] ${isLoggingIn ? 'opacity-50' : 'hover:bg-gray-50'}`}
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin text-emerald-600" size={24} />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            <span className="text-xl">{isLoggingIn ? 'Redirecting...' : 'Sign in with Google'}</span>
          </button>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
              Encrypted & Secure OAuth 2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;