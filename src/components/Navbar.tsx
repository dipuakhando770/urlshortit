import React from 'react';
import { LinkItem, UserProfile, AppSettings } from '../types';
import { Globe, Moon, Sun, ShieldCheck, Zap, User, LogOut } from 'lucide-react';

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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  settings,
  onUpdateSettings,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  onLogout,
  backendUrl,
  onOpenCloudflareTab
}) => {
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
            <span className="font-bold text-lg tracking-tight">{settings.siteName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              SaaS v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'প্রফেশনাল ইউআরএল শর্টনার ও অ্যানালিটিক্স' : 'Professional URL Shortener & Analytics'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Backend Endpoint Indicator */}
        <button
          onClick={onOpenCloudflareTab}
          className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
            darkMode 
              ? 'bg-slate-800/80 border-slate-700 text-indigo-300 hover:border-indigo-500' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
          }`}
          title="VPS Backend API Status & Cloudflare Setup"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>VPS: {backendUrl.replace(/^https?:\/\//, '').split('/')[0]}</span>
        </button>
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

        {/* User Profile dropdown/info */}
        <div className={`flex items-center space-x-3 pl-3 border-l ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold leading-tight">{currentUser.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize flex items-center space-x-1">
              {currentUser.role === 'admin' && <ShieldCheck className="w-3 h-3 text-indigo-500 inline" />}
              <span>{currentUser.role}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className={`p-2 rounded-lg border transition-colors text-slate-500 hover:text-rose-500 ${
              darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-rose-50'
            }`}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
