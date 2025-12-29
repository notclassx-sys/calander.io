import React from 'react';
import { Calendar, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../services/supabaseClient.ts';

const Login: React.FC = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        // This forces the account picker to show up, which usually lists the accounts already on the device.
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline'
        }
      }
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Branding Section */}
      <div className="flex-1 bg-emerald-50 p-8 flex flex-col justify-center items-center text-center">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200">
            <Calendar className="text-white" size={28} />
          </div>
          <span className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Calendar.io</span>
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 leading-none mb-4">
          Your Life, <span className="text-emerald-600 underline decoration-wavy underline-offset-4">Organized</span>.
        </h1>
        <p className="text-gray-600 font-medium max-w-xs">
          The simplest calendar app designed for your mobile device.
        </p>
      </div>

      {/* Action Section */}
      <div className="p-8 pb-12 bg-white flex flex-col items-center border-t-2 border-gray-100">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Get Started</h2>
            <p className="text-sm text-gray-400 mt-1">Sign in with Google to continue</p>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 border-2 border-gray-200 rounded-2xl bg-white text-gray-800 font-black hover:bg-gray-50 transition-all active:scale-[0.96] shadow-sm group"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="text-lg">Sign in with Google</span>
          </button>

          <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
            SECURE LOGIN • NO PASSWORD NEEDED
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;