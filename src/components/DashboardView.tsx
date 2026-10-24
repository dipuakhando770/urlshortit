import React, { useState } from 'react';
import { LinkItem, ClickEvent, AppSettings } from '../types';
import { 
  Link2, 
  MousePointerClick, 
  TrendingUp, 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardViewProps {
  links: LinkItem[];
  clickEvents: ClickEvent[];
  settings: AppSettings;
  darkMode: boolean;
  language: 'bn' | 'en';
  onAddLink: (originalUrl: string, customAlias?: string, title?: string, description?: string) => void;
  onNavigateLinks: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  links,
  clickEvents,
  settings,
  darkMode,
  language,
  onAddLink,
  onNavigateLinks
}) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = links.filter(l => l.status === 'active').length;
  const clicksToday = clickEvents.filter(c => c.clickedAt.startsWith('2026-10-24')).length + 12;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!originalUrl.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে একটি বৈধ ইউআরএল দিন।' : 'Please enter a valid URL.');
      return;
    }
    try {
      new URL(originalUrl);
    } catch {
      setErrorMsg(language === 'bn' ? 'অমান্য ইউআরএল ফরম্যাট।' : 'Invalid URL format.');
      return;
    }

    onAddLink(originalUrl, customAlias, title, 'Created from Dashboard');
    setOriginalUrl('');
    setCustomAlias('');
    setTitle('');
    setSuccessMessage(language === 'bn' ? 'সফলভাবে শর্ট লিংক তৈরি করা হয়েছে!' : 'Short link created successfully!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Chart Data
  const chartData = {
    labels: ['18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct', '23 Oct', 'Today'],
    datasets: [
      {
        fill: true,
        label: language === 'bn' ? 'দৈনিক ক্লিক' : 'Daily Clicks',
        data: [15, 28, 45, 62, 88, 110, clicksToday],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } },
      y: { grid: { color: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } }
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden ${
        darkMode ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800' : 'bg-gradient-to-r from-indigo-50 via-white to-blue-50 border-indigo-100'
      }`}>
        <div className="absolute right-4 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bn' ? 'লিংকপ্রো এসএএস প্ল্যাটফর্ম' : 'LinkPro SaaS Platform'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {language === 'bn' ? 'স্বাগতম, নাসির মিয়া!' : 'Welcome back, Nasir Mia!'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn' 
                ? 'আপনার লিংকগুলো পরিচালনা করুন, তাৎক্ষণিক রিডাইরেক্ট এবং ক্লিক অ্যানালিটিক্স ট্র্যাক করুন।'
                : 'Manage your short links, monitor instantaneous 302 redirects, and analyze click metrics.'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateLinks}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center space-x-2"
            >
              <span>{language === 'bn' ? 'সকল লিংক দেখুন' : 'View All Links'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: language === 'bn' ? 'মোট লিংক' : 'Total Links', value: links.length, icon: Link2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: language === 'bn' ? 'মোট ক্লিক' : 'Total Clicks', value: totalClicks, icon: MousePointerClick, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: language === 'bn' ? 'আজকের ক্লিক' : 'Clicks Today', value: clicksToday, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: language === 'bn' ? 'সক্রিয় লিংক' : 'Active Links', value: `${activeLinks}/${links.length}`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-5 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Shortener & Analytics Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Shortener Card */}
        <div className={`p-6 rounded-2xl border lg:col-span-1 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Plus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold">
              {language === 'bn' ? 'দ্রুত শর্ট লিংক তৈরি করুন' : 'Create Short Link'}
            </h2>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-fadeIn">
              {successMessage}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium animate-fadeIn">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'মূল ইউআরএল (ডেসটিনেশন)' : 'Original URL'}
              </label>
              <input
                type="url"
                required
                placeholder="https://example.com/very/long/path"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'কাস্টম শর্ট কোড (ঐচ্ছিক)' : 'Custom Alias (Optional)'}
              </label>
              <input
                type="text"
                placeholder="e.g. my-brand"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'লিংকের শিরোনাম (ঐচ্ছিক)' : 'Title (Optional)'}
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bn' ? 'শর্ট লিংক জেনারেট করুন' : 'Generate Short URL'}</span>
            </button>
          </form>
        </div>

        {/* Analytics Chart Card */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold">
                {language === 'bn' ? 'ক্লিক প্রবণতা বিশ্লেষণ' : 'Click Trends Overview'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'গত ৭ দিনের দৈনিক ভিজিটর ট্রাফিক' : 'Visitor traffic over the last 7 days'}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 font-semibold">
              Live 302 Tracking
            </span>
          </div>

          <div className="h-64 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Links Table */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">
            {language === 'bn' ? 'সাম্প্রতিক লিংকসমূহ' : 'Recent Links'}
          </h2>
          <button
            onClick={onNavigateLinks}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <th className="pb-3">{language === 'bn' ? 'শিরোনাম ও শর্ট কোড' : 'Title & Short Code'}</th>
                <th className="pb-3">{language === 'bn' ? 'মূল ডেসটিনেশন' : 'Original URL'}</th>
                <th className="pb-3">{language === 'bn' ? 'ক্লিক' : 'Clicks'}</th>
                <th className="pb-3">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="pb-3 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {links.slice(0, 5).map((link) => (
                <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-sm">{link.title || link.shortCode}</div>
                    <a 
                      href={`/${link.shortCode}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 mt-0.5"
                    >
                      <span>lnk.pro/{link.shortCode}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3.5 pr-4 max-w-xs truncate text-slate-500 dark:text-slate-400 text-xs">
                    {link.originalUrl}
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {link.clicks}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      link.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}>
                      {link.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => copyToClipboard(`https://lnk.pro/${link.shortCode}`, link.id)}
                      className={`p-2 rounded-lg border transition-all ${
                        copiedId === link.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : darkMode 
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                      title="Copy Short URL"
                    >
                      {copiedId === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
