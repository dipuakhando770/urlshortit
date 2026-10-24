import React, { useState } from 'react';
import { LinkItem, ClickEvent, AppSettings, CustomDomain, UserProfile, PackageTier, UserDomainPermission } from '../types';
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
  ArrowRight,
  Globe,
  Lock,
  Layers,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowDown,
  RotateCcw
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
  domains: CustomDomain[];
  currentUser: UserProfile;
  packages: PackageTier[];
  permissions: UserDomainPermission[];
  clickEvents: ClickEvent[];
  settings: AppSettings;
  darkMode: boolean;
  language: 'bn' | 'en';
  onAddLink: (
    domainId: string, 
    originalUrl: string, 
    customAlias?: string, 
    title?: string, 
    description?: string,
    existingStage1Url?: string
  ) => Promise<{ 
    success: boolean; 
    error?: string; 
    finalUrl?: string; 
    stage1Url?: string; 
    stage?: 'stage1' | 'stage2';
  }>;
  onNavigateLinks: () => void;
  onNavigateDomains: () => void;
  onNavigateBilling: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  links,
  domains,
  currentUser,
  packages,
  permissions,
  clickEvents,
  settings,
  darkMode,
  language,
  onAddLink,
  onNavigateLinks,
  onNavigateDomains,
  onNavigateBilling
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id || 'dom_1');
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [shorteningStage, setShorteningStage] = useState<'idle' | 'stage1' | 'stage2' | 'completed' | 'error'>('idle');
  const [createdResult, setCreatedResult] = useState<{ finalUrl: string; stage1Url: string } | null>(null);
  const [stage2FailedStage1Url, setStage2FailedStage1Url] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const activeLinks = links.filter(l => l.status === 'active').length;
  const clicksToday = clickEvents.filter(c => c.clickedAt.startsWith('2026-10-24')).length + 12;

  const currentPackage = packages.find(p => p.id === currentUser.packageId) || packages[0];

  const handleCreate = async (e?: React.FormEvent, retryStage1Url?: string) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMessage(null);

    if (!originalUrl.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে একটি বৈধ ইউআরএল দিন।' : 'Please enter a valid URL.');
      return;
    }

    if (retryStage1Url) {
      setShorteningStage('stage2');
    } else {
      setShorteningStage('stage1');
    }

    // Two-stage sequential URL-shortening execution
    const result = await onAddLink(
      selectedDomainId, 
      originalUrl, 
      customAlias, 
      title, 
      'Created from Dashboard Quick Shortener',
      retryStage1Url
    );

    if (!result.success) {
      setShorteningStage('error');
      setErrorMsg(result.error || 'Failed to create short link.');
      if (result.stage === 'stage2' && result.stage1Url) {
        setStage2FailedStage1Url(result.stage1Url);
      }
      return;
    }

    setShorteningStage('completed');
    const finalUrl = result.finalUrl || '';
    const stage1Url = result.stage1Url || '';

    setCreatedResult({
      finalUrl,
      stage1Url
    });

    setStage2FailedStage1Url(null);
    setSuccessMessage(language === 'bn' ? 'সফলভাবে ভিপিএস ফাইনাল শর্ট লিংক তৈরি হয়েছে!' : 'Final short link successfully created by VPS backend!');
  };

  const handleResetForm = () => {
    setOriginalUrl('');
    setCustomAlias('');
    setTitle('');
    setCreatedResult(null);
    setShorteningStage('idle');
    setErrorMsg(null);
    setSuccessMessage(null);
    setStage2FailedStage1Url(null);
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
        data: [18, 32, 54, 76, 95, 120, clicksToday],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
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
              <span>{language === 'bn' ? 'লিংকপ্রো এন্টারপ্রাইজ এসএএস' : 'LinkPro Enterprise URL Shortener'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {language === 'bn' ? `স্বাগতম, ${currentUser.name}!` : `Welcome back, ${currentUser.name}!`}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn' 
                ? 'কাস্টম ব্র্যান্ডেড ডোমেইন, তাৎক্ষণিক থ্রি-ও-টু (302) রিডাইরেক্ট এবং ক্লিক মেট্রিক্স পরিচালনা করুন।'
                : 'Manage branded custom domains, monitor instant 302 redirects, and review subscription quotas.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateBilling}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{currentPackage.name} Tier</span>
            </button>
            <button
              onClick={onNavigateLinks}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center space-x-2"
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
          { label: language === 'bn' ? 'কাস্টম ডোমেইন' : 'Active Domains', value: domains.filter(d => d.isVerified).length, icon: Globe, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: language === 'bn' ? 'মোট ক্লিক' : 'Total Clicks', value: totalClicks, icon: MousePointerClick, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: language === 'bn' ? 'কোটা ব্যবহার' : 'Quota Used', value: currentPackage.maxLinksQuota === -1 ? 'Unlimited' : `${links.length}/${currentPackage.maxLinksQuota}`, icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
        <div className={`p-6 rounded-2xl border lg:col-span-1 flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold">
                  {language === 'bn' ? 'দুই-ধাপ সিকোয়েন্সিয়াল ইউআরএল শর্টনার' : 'Two-Stage Sequential Shortener'}
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                VPS Final /shorten.php
              </span>
            </div>

            {/* Error Message with Stage 2 Retry Option */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium space-y-2 animate-fadeIn">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {shorteningStage === 'error' && stage2FailedStage1Url ? 'Stage 2 (VPS Backend) Failed:' : 'Shortening Error:'}
                    </span>{' '}
                    <span>{errorMsg}</span>
                  </div>
                </div>

                {stage2FailedStage1Url && (
                  <div className="pt-2 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-full">
                      Preserved Stage 1: {stage2FailedStage1Url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCreate(undefined, stage2FailedStage1Url)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shrink-0 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'শুধুমাত্র স্টেজ ২ পুনরায় চেষ্টা করুন' : 'Retry Stage 2 Only'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Success Notification Banner */}
            {successMessage && !createdResult && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-fadeIn flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* SUCCESS VIEW: Prominently display ONLY the VPS Backend-generated Final URL */}
            {createdResult ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'bn' ? 'ভিপিএস ফাইনাল শর্ট ইউআরএল' : 'Authoritative Final Short URL'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                      error: 0 (Live)
                    </span>
                  </div>

                  {/* The primary final URL returned by VPS backend */}
                  <div className="p-3 rounded-lg bg-black/50 border border-indigo-500/30 font-mono text-sm font-bold text-indigo-300 break-all select-all flex items-center justify-between gap-2">
                    <span className="truncate">{createdResult.finalUrl}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdResult.finalUrl, 'result_final')}
                      className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-all"
                      title="Copy Final URL"
                    >
                      {copiedId === 'result_final' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdResult.finalUrl, 'result_btn')}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
                    >
                      {copiedId === 'result_btn' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'result_btn' ? 'Copied Final URL!' : 'Copy Final Link'}</span>
                    </button>
                    <a
                      href={createdResult.finalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 transition-all"
                      title="Open in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ওপেন' : 'Open'}</span>
                    </a>
                  </div>
                </div>

                {/* Transparency breakdown of the 2 sequential stages */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 text-xs space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {language === 'bn' ? 'সিকোয়েন্সিয়াল স্টেপ পর্যবেক্ষণ' : 'Sequential Pipeline Trace'}
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>1. Destination:</span>
                      <span className="truncate max-w-[170px] text-slate-300" title={originalUrl}>{originalUrl}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>2. Stage 1 Branded:</span>
                      <span className="truncate max-w-[170px] text-indigo-400">{createdResult.stage1Url}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>3. Stage 2 VPS Final:</span>
                      <span className="truncate max-w-[170px] text-emerald-400 font-bold">{createdResult.finalUrl}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'আরেকটি নতুন শর্ট লিংক তৈরি করুন' : 'Shorten Another URL'}</span>
                </button>
              </div>
            ) : (
              /* FORM VIEW: Two-Stage Creation Form */
              <form onSubmit={handleCreate} className="space-y-4">
                {/* Visual Step Progress Indicator when processing */}
                {(shorteningStage === 'stage1' || shorteningStage === 'stage2') && (
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-2 animate-pulse">
                    <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400">
                      <span>{language === 'bn' ? 'সিকোয়েন্সিয়াল প্রসেসিং চলমান...' : 'Sequential Pipeline Active'}</span>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${shorteningStage === 'stage1' ? 'bg-indigo-400 animate-ping' : 'bg-emerald-400'}`}></span>
                        <span className={shorteningStage === 'stage1' ? 'text-indigo-300 font-semibold' : 'text-slate-400 line-through'}>
                          Stage 1: Generate branded frontend short code
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${shorteningStage === 'stage2' ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
                        <span className={shorteningStage === 'stage2' ? 'text-emerald-300 font-semibold' : 'text-slate-500'}>
                          Stage 2: Dispatching payload to Ubuntu VPS /shorten.php
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Domain Selector */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'ব্র্যান্ডেড শর্ট ডোমেইন (স্টেজ ১)' : 'Branded Domain (Stage 1)'}
                  </label>
                  <select
                    value={selectedDomainId}
                    onChange={(e) => setSelectedDomainId(e.target.value)}
                    disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none font-mono ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {domains.filter(d => d.isVerified).map((d) => (
                      <option key={d.id} value={d.id}>
                        https://{d.domainName}/
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'মূল ইউআরএল (ডেসটিনেশন) *' : 'Original Destination URL *'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/very/long/path"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'কাস্টম শর্ট কোড (ঐচ্ছিক)' : 'Custom Alias / Code (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. promo2026"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  {shorteningStage === 'stage1' || shorteningStage === 'stage2' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{shorteningStage === 'stage1' ? 'Executing Stage 1...' : 'Calling VPS shorten.php (Stage 2)...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'bn' ? 'সিকোয়েন্সিয়াল শর্ট লিংক তৈরি করুন' : 'Generate Final Short URL'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Analytics Chart Card */}
        <div className={`p-6 rounded-2xl border lg:col-span-2 flex flex-col justify-between ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold">
                {language === 'bn' ? 'ক্লিক প্রবণতা বিশ্লেষণ' : 'Click Trends & Redirection Velocity'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'গত ৭ দিনের দৈনিক ভিজিটর ট্রাফিক ও সরাসরি রিডাইরেক্ট' : 'Direct 302 traffic over the last 7 days'}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Single-Step 302 Active
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
          <div>
            <h2 className="text-base font-bold">
              {language === 'bn' ? 'সাম্প্রতিক লিংকসমূহ (ফাইনাল ভিপিএস ইউআরএল)' : 'Recent Authoritative Links (VPS Backend)'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn' ? 'প্রতিটি লিংক উবুন্টু ভিপিএস /shorten.php দ্বারা যাচাইকৃত।' : 'Authoritative links generated by Ubuntu VPS /shorten.php with direct 302 redirect.'}
            </p>
          </div>
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
                <th className="pb-3">{language === 'bn' ? 'ফাইনাল শর্ট ইউআরএল' : 'Final Short URL (VPS Authoritative)'}</th>
                <th className="pb-3">{language === 'bn' ? 'মূল ডেসটিনেশন' : 'Destination'}</th>
                <th className="pb-3">{language === 'bn' ? 'ক্লিক' : 'Clicks'}</th>
                <th className="pb-3">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="pb-3 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {links.slice(0, 5).map((link) => {
                const displayUrl = link.shortUrl || `https://${link.domainName}/${link.shortCode}`;
                return (
                  <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-semibold text-sm">{link.title || link.shortCode}</div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <a 
                          href={displayUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                        >
                          <span>{displayUrl}</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                      {link.stage1ShortUrl && (
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Stage 1: {link.stage1ShortUrl}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 max-w-xs truncate text-slate-400 text-xs font-mono" title={link.originalUrl}>
                      {link.originalUrl}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-emerald-400">
                      {link.clicks}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        link.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => copyToClipboard(displayUrl, link.id)}
                        className={`p-2 rounded-lg border transition-all ${
                          copiedId === link.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : darkMode 
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Copy Authoritative Short URL"
                      >
                        {copiedId === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
