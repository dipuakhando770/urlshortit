import React from 'react';
import { UserProfile } from '../types';
import { 
  LayoutDashboard, 
  Link2, 
  BarChart3, 
  Wrench, 
  ShieldAlert, 
  ExternalLink,
  Globe,
  CreditCard,
  Cloud
} from 'lucide-react';

export type TabType = 'dashboard' | 'domains' | 'links' | 'billing' | 'analytics' | 'installer' | 'admin' | 'cloudflare' | 'codebase' | 'sandbox';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  darkMode: boolean;
  language: 'bn' | 'en';
  totalLinks: number;
  totalDomains: number;
  totalClicks: number;
  pendingOrdersCount?: number;
  currentUser: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  language,
  totalLinks,
  totalDomains,
  totalClicks,
  pendingOrdersCount = 0,
  currentUser
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      labelBn: 'ড্যাশবোর্ড',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false
    },
    {
      id: 'domains',
      labelBn: 'কাস্টম ডোমেইন',
      labelEn: 'Custom Domains',
      icon: Globe,
      badge: `${totalDomains} verified`,
      adminOnly: false
    },
    {
      id: 'links',
      labelBn: 'আমার লিংকসমূহ',
      labelEn: 'My Links',
      icon: Link2,
      badge: totalLinks,
      adminOnly: false
    },
    {
      id: 'billing',
      labelBn: 'প্যাকেজ ও বিলিং',
      labelEn: 'Plans & Billing',
      icon: CreditCard,
      badge: 'Upgrade',
      adminOnly: false
    },
    {
      id: 'analytics',
      labelBn: 'ক্লিক অ্যানালিটিক্স',
      labelEn: 'Analytics',
      icon: BarChart3,
      badge: totalClicks,
      adminOnly: false
    },
    {
      id: 'sandbox',
      labelBn: 'লাইভ 302 রিডাইরেক্ট',
      labelEn: 'Direct 302 Sandbox',
      icon: ExternalLink,
      badge: 'Live',
      adminOnly: false
    },
    {
      id: 'installer',
      labelBn: 'ব্রাউজার ইন্সটলার',
      labelEn: 'Browser Installer',
      icon: Wrench,
      badge: 'VPS',
      adminOnly: false
    },
    {
      id: 'admin',
      labelBn: 'অ্যাডমিন কনসোল',
      labelEn: 'Admin Panel',
      icon: ShieldAlert,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : 'Admin',
      adminOnly: true
    },
    {
      id: 'cloudflare',
      labelBn: 'ক্লাউডফ্লেয়ার ও ভিপিএস',
      labelEn: 'Cloudflare & VPS API',
      icon: Cloud,
      badge: 'API',
      adminOnly: false
    }
  ];

  const filteredItems = menuItems.filter(item => {
    if (item.adminOnly && currentUser.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <aside className={`w-full md:w-64 p-4 border-r flex flex-col justify-between shrink-0 transition-colors duration-200 ${
      darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {language === 'bn' ? 'মেইন মেনু' : 'Main Navigation'}
        </div>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : darkMode
                  ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
              </div>
              {item.badge !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : darkMode
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Account Role Info Box */}
      <div className={`mt-6 p-3.5 rounded-2xl border ${
        darkMode ? 'bg-slate-800/40 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-400">Role</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold ${
            currentUser.role === 'admin' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
          }`}>
            {currentUser.role}
          </span>
        </div>
        <div className="text-xs font-bold truncate">{currentUser.name}</div>
        <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
      </div>
    </aside>
  );
};
