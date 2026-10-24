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
  AlertCircle
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
  onAddLink: (domainId: string, originalUrl: string, customAlias?: string, title?: string, description?: string) => { success: boolean; error?: string } | Promise<{ success: boolean; error?: string }>;
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!originalUrl.trim()) return;

    const result = await onAddLink(selectedDomainId, originalUrl, customAlias, title, description);
    if (!result.success) {
      setModalError(result.error || 'Failed to create link.');
      return;
    }

    setOriginalUrl('');
    setCustomAlias('');
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
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
          onClick={() => {
            setModalError(null);
            setIsModalOpen(true);
          }}
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
                <th className="p-4">{language === 'bn' ? 'ডোমেইন ও শর্ট লিংক' : 'Domain & Short URL'}</th>
                <th className="p-4">{language === 'bn' ? 'মূল ডেসটিনেশন' : 'Destination URL'}</th>
                <th className="p-4">{language === 'bn' ? 'ক্লিক' : 'Clicks'}</th>
                <th className="p-4">{language === 'bn' ? 'রিডাইরেক্ট কোড' : 'Type'}</th>
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
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-sm">{link.title || `Short /${link.shortCode}`}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-mono text-indigo-500 font-bold">
                          {link.domainName}/{link.shortCode}
                        </span>
                        <a 
                          href={link.originalUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center"
                          title="Open Destination"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-400 text-xs font-mono">
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
                        onClick={() => copyToClipboard(`https://${link.domainName}/${link.shortCode}`, link.id)}
                        className={`p-2 rounded-lg border transition-all inline-flex items-center ${
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Link Modal with Custom Domain Selector */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold">
                  {language === 'bn' ? 'ব্র্যান্ডেড শর্ট লিংক তৈরি করুন' : 'Create Branded Short Link'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Domain Selector with Permission status */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-400">
                  {language === 'bn' ? 'শর্ট লিংক ডোমেইন নির্বাচন করুন *' : 'Select Short Domain *'}
                </label>
                <div className="space-y-2">
                  <select
                    value={selectedDomainId}
                    onChange={(e) => setSelectedDomainId(e.target.value)}
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
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-500/25"
                >
                  {language === 'bn' ? 'সংরক্ষণ ও তৈরি করুন' : 'Generate Short Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-sm p-6 rounded-2xl border shadow-xl text-center ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-1">QR Code Scanner</h3>
            <p className="text-xs text-slate-400 mb-4">{qrModalLink.domainName}/{qrModalLink.shortCode}</p>

            <div className="bg-white p-4 rounded-2xl inline-block border shadow-inner mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://${qrModalLink.domainName}/${qrModalLink.shortCode}`} 
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
