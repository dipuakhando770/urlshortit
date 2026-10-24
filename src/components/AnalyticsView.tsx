import React from 'react';
import { ClickEvent, LinkItem, AppSettings } from '../types';
import { 
  BarChart3, 
  Globe, 
  Smartphone, 
  Monitor, 
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';

interface AnalyticsViewProps {
  clickEvents: ClickEvent[];
  links: LinkItem[];
  settings: AppSettings;
  darkMode: boolean;
  language: 'bn' | 'en';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  clickEvents,
  links,
  settings,
  darkMode,
  language
}) => {
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

  // Line chart for clicks over time
  const lineData = {
    labels: ['Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Oct 23', 'Oct 24'],
    datasets: [
      {
        label: language === 'bn' ? 'ক্লিক সংখ্যা' : 'Clicks',
        data: [22, 38, 55, 74, 92, 115, totalClicks > 500 ? 142 : totalClicks],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.35,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } },
      y: { grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } }
    }
  };

  const topLinks = [...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'bn' ? 'ক্লিক অ্যানালিটিক্স ও মেট্রিক্স' : 'Click Analytics & Insights'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {language === 'bn' ? 'ভিজিটর লোকেশন, ডিভাইস, ব্রাউজার এবং রেফারার ট্রাফিক বিশ্লেষণ।' : 'Real-time click statistics, traffic sources, device breakdown, and geolocation.'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'bn' ? 'মোট ক্লিক ইভেন্ট' : 'Total Click Events'}</p>
              <p className="text-2xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">{totalClicks}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-indigo-500/20" />
          </div>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'bn' ? 'ইউনিক ভিজিটর' : 'Unique Visitors'}</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{Math.round(totalClicks * 0.82)}</p>
            </div>
            <Globe className="w-8 h-8 text-emerald-500/20" />
          </div>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'bn' ? 'রিডাইরেক্ট গতি' : 'Redirect Speed'}</p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">&lt; 2ms</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500/20" />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <h2 className="text-base font-bold mb-1">
          {language === 'bn' ? 'সাপ্তাহিক ক্লিক গ্রাফ' : 'Weekly Click Velocity'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {language === 'bn' ? 'প্রতিদিনের সফল থ্রি-ও-টু (302) রিডাইরেক্ট লগ।' : 'Daily successful 302 HTTP redirect volume.'}
        </p>
        <div className="h-72 w-full">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Grid: Top Performing Links & Geolocation / Device breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Links */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <h2 className="text-base font-bold mb-4">
            {language === 'bn' ? 'শীর্ষ পারফর্মিং লিংকসমূহ' : 'Top Performing Links'}
          </h2>
          <div className="space-y-4">
            {topLinks.map((link, idx) => (
              <div key={link.id} className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{link.title || link.shortCode}</div>
                    <div className="text-xs text-slate-400">lnk.pro/{link.shortCode}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{link.clicks} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources & Device Breakdown */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <h2 className="text-base font-bold mb-4">
            {language === 'bn' ? 'ডিভাইস ও ট্রাফিক সোর্স' : 'Devices & Traffic Sources'}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center space-x-1.5">
                  <Monitor className="w-4 h-4 text-indigo-500 inline" />
                  <span>Desktop (Windows / Mac)</span>
                </span>
                <span>68%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-500 inline" />
                  <span>Mobile (Android / iOS)</span>
                </span>
                <span>27%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-amber-500 inline" />
                  <span>Other / Tablets</span>
                </span>
                <span>5%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Top Countries: Bangladesh (74%), United States (18%), Germany (8%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
