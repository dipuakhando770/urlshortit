import React from 'react';
import { AppSettings } from '../types';
import { Zap, Heart } from 'lucide-react';

interface FooterProps {
  settings: AppSettings;
  darkMode: boolean;
  language: 'bn' | 'en';
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  darkMode,
  language
}) => {
  return (
    <footer className={`py-6 px-6 border-t text-xs transition-colors ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-indigo-500" />
          <span className="font-bold">{settings.siteName}</span>
          <span>&copy; 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>PHP 8.2 • Nginx • MariaDB PDO</span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
            <span>for Professional SaaS</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
