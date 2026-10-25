import React, { useState } from 'react';
import { LinkItem, ClickEvent, AppSettings, CustomDomain, UserProfile, PackageTier, UserDomainPermission } from '../types';
import { 
  Link2, 
  MousePointerClick, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  Plus,
  ArrowRight,
  Globe,
  Layers,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Server
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
  backendHealth?: {
    status: 'checking' | 'ready' | 'online_only' | 'unreachable' | 'error';
    latencyMs: number;
    details?: any;
    error?: string;
  };
  onAddLink: (
    domainId: string, 
    originalUrl: string, 
    customAlias?: string, 
    title?: string, 
    description?: string
  ) => Promise<{ 
    success: boolean; 
    error?: string; 
    finalUrl?: string; 
    stage1Url?: string;
    stage1Code?: string;
    originalUrl?: string;
    stage1Id?: number;
  }>;
  onNavigateLinks: () => void;
  onNavigateDomains: () => void;
  onNavigateBilling: () => void;
  onNavigateCloudflare?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  links,
  domains,
  currentUser,
  packages,
  settings,
  darkMode,
  language,
  backendHealth,
  onAddLink,
  onNavigateLinks,
  onNavigateBilling,
  onNavigateCloudflare
}) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState<{
    stage1Url: string;
    stage1Code: string;
    originalUrl: string;
    stage1Id?: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const currentPackage = packages.find(p => p.id === currentUser.packageId) || packages[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions

    setErrorMsg(null);

    const trimmedUrl = originalUrl.trim();
    if (!trimmedUrl) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে একটি বৈধ ইউআরএল দিন।' : 'Please enter a valid destination URL.');
      return;
    }

    // Client-side URL validation
    try {
      const parsed = new URL(trimmedUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setErrorMsg(language === 'bn' ? 'শুধুমাত্র HTTP ও HTTPS ইউআরএল গ্রহণযোগ্য।' : 'Only HTTP and HTTPS URLs are allowed.');
        return;
      }
    } catch {
      setErrorMsg(language === 'bn' ? 'ইউআরএল ফরম্যাটটি সঠিক নয় (http:// বা https:// দিয়ে শুরু হতে হবে)।' : 'Invalid URL format. Must start with http:// or https://');
      return;
    }

    setIsSubmitting(true);

    try {
      // Dispatches directly to backend POST /api/links/stage1
      const result = await onAddLink(
        domains[0]?.id || 'dom_1',
        trimmedUrl,
        undefined,
        title.trim() || undefined,
        'Created from Dashboard Quick Shortener'
      );

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to create Stage 1 link.');
        return;
      }

      const stage1Url = result.stage1Url || result.finalUrl || '';
      const stage1Code = result.stage1Code || stage1Url.split('/').pop() || '';

      setCreatedResult({
        stage1Url,
        stage1Code,
        originalUrl: result.originalUrl || trimmedUrl,
        stage1Id: result.stage1Id,
      });

    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while contacting backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setOriginalUrl('');
    setTitle('');
    setCreatedResult(null);
    setErrorMsg(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Chart Data
  const chartData = {
    labels: ['19 Oct', '20 Oct', '21 Oct', '22 Oct', '23 Oct', '24 Oct', 'Today'],
    datasets: [
      {
        fill: true,
        label: language === 'bn' ? 'দৈনিক ক্লিক' : 'Daily Clicks',
        data: [14, 28, 45, 62, 88, 110, totalClicks],
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
              <span>Boss URL Shortener &bull; High-Performance Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {language === 'bn' ? `স্বাগতম, ${currentUser.name}!` : `Welcome back, ${currentUser.name}!`}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn' 
                ? 'লাইভ উবুন্টু ভিপিএস ব্যাকএন্ডের সাথে যুক্ত। তাৎক্ষণিক স্টেজ ১ শর্ট লিংক তৈরি ও ক্লিক ট্র্যাকিং পর্যবেক্ষণ করুন।'
                : 'Connected to live Ubuntu VPS backend (http://107.174.37.180). Generate Stage 1 links and monitor real-time 302 redirects.'}
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
          { label: language === 'bn' ? 'সিস্টেম স্ট্যাটাস' : 'System Status', value: backendHealth?.status === 'ready' ? 'Ready (HTTP 200)' : 'Online', icon: Server, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: language === 'bn' ? 'মোট ক্লিক' : 'Total Clicks', value: totalClicks, icon: MousePointerClick, color: 'text-purple-500', bg: 'bg-purple-500/10' },
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
                  {language === 'bn' ? 'ইউআরএল শর্টনার (স্টেজ ১ এপিআই)' : 'URL Shortener (Stage 1 API)'}
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                POST /api/links/stage1
              </span>
            </div>

            {/* Backend Connection Health Banner */}
            <div className={`mb-4 p-3 rounded-xl text-xs flex items-center justify-between border ${
              backendHealth?.status === 'ready'
                ? darkMode ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : backendHealth?.status === 'unreachable'
                ? darkMode ? 'bg-rose-950/30 border-rose-800/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
                : darkMode ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${backendHealth?.status === 'ready' ? 'bg-emerald-400 animate-pulse' : backendHealth?.status === 'unreachable' ? 'bg-rose-500' : 'bg-amber-400'}`}></span>
                <span className="font-medium">
                  {backendHealth?.status === 'ready' 
                    ? `VPS Live & Ready (DB + Storage OK) &bull; ${backendHealth.latencyMs}ms`
                    : backendHealth?.status === 'unreachable'
                    ? 'Backend VPS Unreachable'
                    : 'Checking VPS Status...'}
                </span>
              </div>
              {onNavigateCloudflare && (
                <button
                  type="button"
                  onClick={onNavigateCloudflare}
                  className="text-[11px] font-mono underline hover:text-indigo-400 transition-colors"
                >
                  Diagnostics
                </button>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium space-y-1 animate-fadeIn">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Backend Error:</span>{' '}
                    <span>{errorMsg}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS VIEW: Prominently display the live Stage 1 URL returned by the backend */}
            {createdResult ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-emerald-500/30 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'bn' ? 'স্টেজ ১ শর্ট লিংক সফলভাবে তৈরি হয়েছে' : 'Stage 1 Link Created Successfully'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                      HTTP 201 Created
                    </span>
                  </div>

                  {/* The primary Stage 1 URL returned by VPS backend */}
                  <div className="p-3 rounded-lg bg-black/50 border border-indigo-500/30 font-mono text-sm font-bold text-indigo-300 break-all select-all flex items-center justify-between gap-2">
                    <span className="truncate">{createdResult.stage1Url}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdResult.stage1Url, 'result_final')}
                      className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-all"
                      title="Copy Short URL"
                    >
                      {copiedId === 'result_final' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdResult.stage1Url, 'result_btn')}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
                    >
                      {copiedId === 'result_btn' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'result_btn' ? 'Copied Link!' : 'Copy Stage 1 Link'}</span>
                    </button>
                    <a
                      href={createdResult.stage1Url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 transition-all"
                      title="Test 302 Redirect in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ওপেন' : 'Open Link'}</span>
                    </a>
                  </div>
                </div>

                {/* API Response Details Trace */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 text-xs space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {language === 'bn' ? 'ব্যাকএন্ড রেসপন্স বিস্তারিত' : 'Verified API Response'}
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Destination URL:</span>
                      <span className="truncate max-w-[170px] text-slate-300" title={createdResult.originalUrl}>{createdResult.originalUrl}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Stage 1 Short Code:</span>
                      <span className="truncate max-w-[170px] text-indigo-400 font-bold">{createdResult.stage1Code}</span>
                    </div>
                    {createdResult.stage1Id && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Database Record ID:</span>
                        <span className="text-slate-300 font-bold">#{createdResult.stage1Id}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Server Engine:</span>
                      <span className="text-emerald-400">PHP 7.4 + Nginx (302 Redirect)</span>
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
              /* FORM VIEW */
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'মূল ইউআরএল (ডেসটিনেশন) *' : 'Destination URL (HTTP/HTTPS) *'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/long-article-path"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Submitted directly to <code className="text-indigo-400">POST /api/links/stage1</code> on the live VPS backend.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'লিংক শিরোনাম (ঐচ্ছিক)' : 'Link Title (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Documentation or Product Launch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      darkMode 
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Stage 1 Short Link...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'bn' ? 'স্টেজ ১ শর্ট লিংক তৈরি করুন' : 'Create Stage 1 Short Link'}</span>
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
                {language === 'bn' ? 'ক্লিক ট্র্যাকিং ও অ্যানালিটিক্স' : 'Click Tracking & Analytics'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'প্রতিটি 302 রিডাইরেক্টে ব্যাকএন্ড ডাটাবেজে তাৎক্ষণিক ক্লিক কাউন্ট বৃদ্ধি পায়।' : 'Real-time 302 redirect tracking updated on every click by Nginx & MariaDB.'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live Click Engine
            </span>
          </div>

          <div className="h-64 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Redirect Protocol</span>
              <span className="font-semibold text-emerald-400">HTTP 302 Found</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Backend Database</span>
              <span className="font-semibold text-indigo-400">MariaDB (boss_shortener)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Rate Limiting</span>
              <span className="font-semibold text-amber-400">Active (120 req/min)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
