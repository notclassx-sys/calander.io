
import React from 'react';
import { Calendar, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Login: React.FC = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
      // Optionally, display an error message to the user.
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left side: Branding */}
      <div className="w-full md:w-1/2 bg-emerald-50 p-12 flex flex-col justify-center items-start">
        <div className="flex items-center gap-2 mb-8 animate-fade-in">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Calendar className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Calendar.io</span>
        </div>
        
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Schedule your life with <span className="text-emerald-600">intelligence</span>.
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed">
          The all-in-one platform to manage your appointments, meetings, and personal goals in a beautiful, light-themed interface.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-full shadow-sm text-emerald-600"><Zap size={20} /></div>
            <p className="text-gray-700 font-medium">Smart AI Scheduling</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-full shadow-sm text-emerald-600"><ShieldCheck size={20} /></div>
            <p className="text-gray-700 font-medium">Secure Google Integration</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-full shadow-sm text-emerald-600"><CheckCircle size={20} /></div>
            <p className="text-gray-700 font-medium">Multi-device Sync</p>
          </div>
        </div>
      </div>

      {/* Right side: Login Action */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white border-l border-gray-100">
        <div className="max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-10">Sign in to access your dashboard and schedule</p>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 border border-gray-300 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span className="group-hover:translate-x-1 transition-transform">Continue with Google</span>
          </button>

          <p className="mt-8 text-sm text-gray-400">
            By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
