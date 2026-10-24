import React, { useState } from 'react';
import { LinkItem, AppSettings, CustomDomain, UserProfile, UserDomainPermission, PackageTier } from '../types';
import { 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  QrCode, 
  Filter, 
  Sparkles,
  Calendar,
  MousePointerClick,
  Globe,
  Lock,
  Unlock,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface LinksViewProps {
  links: LinkItem[];
  domains: CustomDomain[];
  currentUser: UserProfile;
  permissions: UserDomainPermission[];
  packages: PackageTier[];
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
  onDeleteLink: (id: string) => void;
}

export const LinksView: React.FC<LinksViewProps> = ({
  links,
  domains,
  currentUser,
  permissions,
  packages,
  settings,
  darkMode,
  language,
  onAddLink,
  onDeleteLink
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id || 'dom_1');
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalLink, setQrModalLink] = useState<LinkItem | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [shorteningStage, setShorteningStage] = useState<'idle' | 'stage1' | 'stage2' | 'completed' | 'error'>('idle');
  const [stage2FailedStage1Url, setStage2FailedStage1Url] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{ finalUrl: string; stage1Url: string } | null>(null);

  const currentPackage = packages.find(p => p.id === currentUser.packageId);

  // Check if current user has permission for a specific domain
  const checkDomainPermission = (dom: CustomDomain) => {
    // 1. Verification & active
    if (!dom.isVerified) return { allowed: false, reason: 'Pending DNS verification' };
    if (dom.status !== 'active') return { allowed: false, reason: 'Domain suspended' };

    // 2. Explicit user denial
    const explicit = permissions.find(p => p.userId === currentUser.id && p.domainId === dom.id);
    if (explicit) {
      if (!explicit.isAllowed) return { allowed: false, reason: 'Admin explicitly denied' };
      return { allowed: true, reason: 'Explicitly authorized' };
    }

    // 3. All-domains permission
    if (currentUser.hasAllDomainsAccess || currentPackage?.hasAllDomainsAccess) {
      return { allowed: true, reason: 'Unlimited Domains VIP' };
    }

    // 4. Owner
    if (dom.userId === currentUser.id) return { allowed: true, reason: 'Domain Owner' };

    // 5. Global domain for paid users
    if (dom.isGlobal && currentUser.packageId !== 'pkg_free') {
      return { allowed: true, reason: 'Global Paid Tier' };
    }

    return { allowed: false, reason: 'Requires Plan Upgrade' };
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (link.title && link.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || link.status === statusFilter;
    const matchesDomain = domainFilter === 'all' || link.domainId === domainFilter;
    return matchesSearch && matchesStatus && matchesDomain;
  });

  const handleOpenModal = () => {
    setModalError(null);
    setShorteningStage('idle');
    setStage2FailedStage1Url(null);
    setCreatedResult(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOriginalUrl('');
    setCustomAlias('');
    setTitle('');
    setDescription('');
    setModalError(null);
    setCreatedResult(null);
    setStage2FailedStage1Url(null);
    setShorteningStage('idle');
  };

  const handleCreateSubmit = async (e?: React.FormEvent, retryStage1Url?: string) => {
    if (e) e.preventDefault();
    setModalError(null);
    if (!originalUrl.trim()) return;

    if (retryStage1Url) {
      setShorteningStage('stage2');
    } else {
      setShorteningStage('stage1');
    }

    const result = await onAddLink(
      selectedDomainId, 
      originalUrl, 
      customAlias, 
      title, 
      description,
      retryStage1Url
    );

    if (!result.success) {
      setShorteningStage('error');
      setModalError(result.error || 'Failed to create link.');
      if (result.stage === 'stage2' && result.stage1Url) {
        setStage2FailedStage1Url(result.stage1Url);
      }
      return;
    }

    setShorteningStage('completed');
    const finalUrl = result.finalUrl || '';
    const stage1Url = result.stage1Url || '';
    setCreatedResult({ finalUrl, stage1Url });
    setStage2FailedStage1Url(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'আমার শর্ট লিংকসমূহ ও ব্র্যান্ডেড ডোমেইন' : 'Short Links & Branded Domains'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'কাস্টম ডোমেইন নির্বাচন করে নতুন শর্ট লিংক তৈরি করুন এবং পরিচালনা করুন।' : 'Manage all short URLs with custom domains and instant single-step 302 redirects.'}
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন লিংক তৈরি করুন' : 'Create Short Link'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'লিংক বা শর্ট কোড দিয়ে খুঁজুন...' : 'Search by URL or code...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Domain Filter */}
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="all">{language === 'bn' ? 'সকল ডোমেইন' : 'All Domains'}</option>
              {domains.map(d => (
                <option key={d.id} value={d.id}>{d.domainName}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="all">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
              <option value="active">{language === 'bn' ? 'সক্রিয় (Active)' : 'Active'}</option>
              <option value="expired">{language === 'bn' ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired'}</option>
              <option value="disabled">{language === 'bn' ? 'নিষ্ক্রিয় (Disabled)' : 'Disabled'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links List Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 ${
                darkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <th className="p-4">{language === 'bn' ? 'ফাইনাল শর্ট ইউআরএল (ভিপিএস)' : 'Final Short URL (VPS Authoritative)'}</th>
                <th className="p-4">{language === 'bn' ? 'মূল ডেসটিনেশন' : 'Destination URL'}</th>
                <th className="p-4">{language === 'bn' ? 'ক্লিক' : 'Clicks'}</th>
                <th className="p-4">{language === 'bn' ? 'রিডাইরেক্ট కోড' : 'Type'}</th>
                <th className="p-4">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="p-4 text-right">{language === 'bn' ? 'অ্যাকশনসমূহ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                    {language === 'bn' ? 'কোনো লিংক পাওয়া যায়নি।' : 'No links found matching your criteria.'}
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const displayFinalUrl = link.shortUrl || `https://${link.domainName}/${link.shortCode}`;
                  return (
                    <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-sm">{link.title || `Short /${link.shortCode}`}</div>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <a 
                            href={displayFinalUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                          >
                            <span>{displayFinalUrl}</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                        {link.stage1ShortUrl && (
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Stage 1: {link.stage1ShortUrl}
                          </div>
                        )}
                      </td>
                      <td className="p-4 max-w-xs truncate text-slate-400 text-xs font-mono" title={link.originalUrl}>
                        {link.originalUrl}
                      </td>
                      <td className="p-4 font-semibold text-emerald-400 flex items-center space-x-1">
                        <MousePointerClick className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{link.clicks}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          HTTP {link.redirectType || '302'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          link.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {link.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => setQrModalLink(link)}
                          className={`p-2 rounded-lg border transition-all inline-flex items-center ${
                            darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                          title="Show QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(displayFinalUrl, link.id)}
                          className={`p-2 rounded-lg border transition-all inline-flex items-center ${
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
                        <button
                          onClick={() => onDeleteLink(link.id)}
                          className={`p-2 rounded-lg border transition-all inline-flex items-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 ${
                            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                          }`}
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Link Modal with Sequential Two-Stage URL Shortening */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold">
                  {language === 'bn' ? 'দুই-ধাপ সিকোয়েন্সিয়াল ইউআরএল শর্টনার' : 'Two-Stage Sequential Shortener'}
                </h3>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Error Display with Stage 2 Retry Option */}
            {modalError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold space-y-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {shorteningStage === 'error' && stage2FailedStage1Url ? 'Stage 2 (VPS Backend) Failed:' : 'Error:'}
                    </span>{' '}
                    <span>{modalError}</span>
                  </div>
                </div>

                {stage2FailedStage1Url && (
                  <div className="pt-2 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[240px]">
                      Stage 1 URL: {stage2FailedStage1Url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCreateSubmit(undefined, stage2FailedStage1Url)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shrink-0 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'শুধুমাত্র স্টেজ ২ পুনরায় চেষ্টা করুন' : 'Retry Stage 2 Only'}</span>
                    </button>
                  </div>
                )}
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
                      onClick={() => copyToClipboard(createdResult.finalUrl, 'modal_final')}
                      className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 transition-all"
                      title="Copy Final URL"
                    >
                      {copiedId === 'modal_final' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdResult.finalUrl, 'modal_btn')}
                      className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
                    >
                      {copiedId === 'modal_btn' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'modal_btn' ? 'Copied Final URL!' : 'Copy Final Link'}</span>
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
                      <span className="truncate max-w-[200px] text-slate-300" title={originalUrl}>{originalUrl}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>2. Stage 1 Branded:</span>
                      <span className="truncate max-w-[200px] text-indigo-400">{createdResult.stage1Url}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>3. Stage 2 VPS Final:</span>
                      <span className="truncate max-w-[200px] text-emerald-400 font-bold">{createdResult.finalUrl}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
                  >
                    {language === 'bn' ? 'সম্পন্ন (Done)' : 'Close'}
                  </button>
                </div>
              </div>
            ) : (
              /* FORM VIEW */
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                {/* Visual Step Progress Indicator */}
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

                {/* Domain Selector with Permission status */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'শর্ট লিংক ডোমেইন নির্বাচন করুন *' : 'Select Short Domain *'}
                  </label>
                  <div className="space-y-2">
                    <select
                      value={selectedDomainId}
                      onChange={(e) => setSelectedDomainId(e.target.value)}
                      disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      {domains.map((dom) => {
                        const perm = checkDomainPermission(dom);
                        return (
                          <option 
                            key={dom.id} 
                            value={dom.id}
                            disabled={!perm.allowed}
                          >
                            {dom.domainName} {perm.allowed ? '✓ (Authorized)' : `🔒 [${perm.reason}]`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'মূল ইউআরএল (ডেসটিনেশন) *' : 'Destination URL *'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/very-long-path"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'কাস্টম শর্ট কোড / অ্যালিয়াস (ঐচ্ছিক)' : 'Custom Alias (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. spring26"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    {language === 'bn' ? 'লিংকের শিরোনাম (ঐচ্ছিক)' : 'Title (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Twitter Campaign"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={shorteningStage === 'stage1' || shorteningStage === 'stage2'}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium shadow-md shadow-indigo-500/25 flex items-center space-x-2"
                  >
                    {shorteningStage === 'stage1' || shorteningStage === 'stage2' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{shorteningStage === 'stage1' ? 'Executing Stage 1...' : 'Calling VPS shorten.php (Stage 2)...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'সংরক্ষণ ও তৈরি করুন' : 'Generate Short Link'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal for Authoritative Short URL */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-sm p-6 rounded-2xl border shadow-xl text-center ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-1">QR Code Scanner</h3>
            <p className="text-xs text-indigo-400 font-mono mb-4 break-all">
              {qrModalLink.shortUrl || `https://${qrModalLink.domainName}/${qrModalLink.shortCode}`}
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block border shadow-inner mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrModalLink.shortUrl || `https://${qrModalLink.domainName}/${qrModalLink.shortCode}`)}`} 
                alt="QR Code" 
                className="w-40 h-40 mx-auto"
              />
            </div>

            <button
              onClick={() => setQrModalLink(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
