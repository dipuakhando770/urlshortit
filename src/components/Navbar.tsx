import React from 'react';
import { UserProfile, AppSettings } from '../types';
import { Globe, Moon, Sun, Zap, RefreshCw, Server, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  onLogout: () => void;
  backendUrl: string;
  onOpenCloudflareTab: () => void;
  backendHealth?: {
    status: 'checking' | 'ready' | 'online_only' | 'unreachable' | 'error';
    latencyMs: number;
    details?: any;
    error?: string;
  };
  onRefreshHealth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  settings,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  backendUrl,
  onOpenCloudflareTab,
  backendHealth,
  onRefreshHealth
}) => {
  const isReady = backendHealth?.status === 'ready';
  const isOnline = backendHealth?.status === 'online_only';
  const isUnreachable = backendHealth?.status === 'unreachable' || backendHealth?.status === 'error';
  const isChecking = backendHealth?.status === 'checking';

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b shadow-xs transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
          <Zap className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight">Boss URL Shortener</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono">
              v1.0 VPS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'হাই-পারফরম্যান্স ইউআরএল শর্টনার ও এনালিস্ট' : 'High-Performance URL Shortener & Analytics'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Backend Connection Status Badge */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onOpenCloudflareTab}
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              isReady
                ? darkMode
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:border-emerald-500'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : isOnline
                ? darkMode
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:border-amber-500'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : isUnreachable
                ? darkMode
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:border-rose-500'
                  : 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                : darkMode
                ? 'bg-slate-800/80 border-slate-700 text-indigo-300 hover:border-indigo-500'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
            title="Click to view VPS Backend & Diagnostic Status"
          >
            {isReady && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>VPS: Online & Ready (DB OK)</span>
                {backendHealth?.latencyMs ? <span className="text-[10px] opacity-75">({backendHealth.latencyMs}ms)</span> : null}
              </>
            )}
            {isOnline && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>VPS: Online (Checking)</span>
              </>
            )}
            {isUnreachable && (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>VPS: Unreachable</span>
              </>
            )}
            {isChecking && (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                <span>VPS: Checking...</span>
              </>
            )}
          </button>

          {onRefreshHealth && (
            <button
              onClick={onRefreshHealth}
              className={`p-1.5 rounded-lg border transition-colors ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Refresh VPS Status Check (GET /api/health + /api/ready)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            darkMode 
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
          title="Switch Language (Bangla / English)"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-500" />
          <span>{language === 'bn' ? 'English (EN)' : 'বাংলা (BN)'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg border transition-colors ${
            darkMode 
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile */}
        <div className={`flex items-center space-x-3 pl-3 border-l ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
