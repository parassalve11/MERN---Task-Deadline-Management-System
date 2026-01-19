import React, { useState } from 'react';
import { LogOut, Loader2, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

const LogOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    setIsLoading(true);
    try {
      // 1. API Call to backend
      await axiosInstance.post('/auth/signout');
      
      // 2. Clear Auth Data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 3. Redirect to login (Vite style)
      navigate('/signin');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogOut}
      disabled={isLoading}
      className="group relative flex items-center justify-center gap-3 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 rounded-xl text-red-500 font-bold text-sm transition-all duration-300 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] overflow-hidden"
    >
      {/* Glossy Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      )}

      <span className="relative z-10 tracking-wide">
        {isLoading ? 'SECURELY EXITING...' : 'LOGOUT'}
      </span>

      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default LogOutButton;