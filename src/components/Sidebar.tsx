import React from 'react';
import { 
  LayoutDashboard, 
  Link2, 
  BarChart3, 
  Wrench, 
  ShieldAlert, 
  Code2, 
  ExternalLink,
  Zap
} from 'lucide-react';

export type TabType = 'dashboard' | 'links' | 'analytics' | 'installer' | 'admin' | 'codebase' | 'sandbox';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  darkMode: boolean;
  language: 'bn' | 'en';
  totalLinks: number;
  totalClicks: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  language,
  totalLinks,
  totalClicks
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      labelBn: 'ড্যাশবোর্ড',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'links',
      labelBn: 'আমার লিংকসমূহ',
      labelEn: 'My Links',
      icon: Link2,
      badge: totalLinks
    },
    {
      id: 'analytics',
      labelBn: 'ক্লিক অ্যানালিটিক্স',
      labelEn: 'Analytics',
      icon: BarChart3,
      badge: totalClicks
    },
    {
      id: 'sandbox',
      labelBn: 'লাইভ রিডাইরেক্ট টেস্ট',
      labelEn: 'Redirect Sandbox',
      icon: ExternalLink,
      badge: 'Live'
    },
    {
      id: 'installer',
      labelBn: 'ব্রাউজার ইন্সটলার উইজার্ড',
      labelEn: 'Browser Installer',
      icon: Wrench,
      badge: 'VPS'
    },
    {
      id: 'admin',
      labelBn: 'অ্যাডমিন প্যানেল',
      labelEn: 'Admin Panel',
      icon: ShieldAlert,
      badge: 'Secure'
    },
    {
      id: 'codebase',
      labelBn: 'পিএইচপি সোর্স কোড ও রিপো',
      labelEn: 'PHP Source & GitHub',
      icon: Code2,
      badge: 'GitHub'
    }
  ];

  return (
    <aside className={`w-64 min-h-[calc(100vh-65px)] flex flex-col border-r transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {language === 'bn' ? 'প্রধান মেনু' : 'Main Navigation'}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : darkMode
                    ? 'hover:bg-slate-800 hover:text-white text-slate-300'
                    : 'hover:bg-slate-200/60 hover:text-slate-900 text-slate-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
              </div>
              {item.badge !== null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? 'bg-indigo-700 text-indigo-100'
                    : darkMode
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-white text-indigo-600 border border-slate-200 shadow-2xs'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VPS Deployment Status Box */}
      <div className="mt-auto p-4 m-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
          <Zap className="w-4 h-4" />
          <span>Ubuntu VPS Ready</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          PHP 8.2 • Nginx FastCGI • MariaDB PDO • Clean 302 Redirection
        </p>
        <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
          <span>● Status: Online</span>
          <span>100% Uptime</span>
        </div>
      </div>
    </aside>
  );
};
