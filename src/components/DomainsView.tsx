import React, { useState } from 'react';
import { CustomDomain, UserProfile, UserDomainPermission, PackageTier } from '../types';
import { 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  Info,
  Server,
  Zap,
  Trash2
} from 'lucide-react';

interface DomainsViewProps {
  domains: CustomDomain[];
  currentUser: UserProfile;
  permissions: UserDomainPermission[];
  packages: PackageTier[];
  darkMode: boolean;
  language: 'bn' | 'en';
  onAddDomain: (domainName: string, isGlobal: boolean) => void;
  onVerifyDomain: (domainId: string) => void;
  onDeleteDomain: (domainId: string) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({
  domains,
  currentUser,
  permissions,
  packages,
  darkMode,
  language,
  onAddDomain,
  onVerifyDomain,
  onDeleteDomain
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDomainForDns, setSelectedDomainForDns] = useState<CustomDomain | null>(null);
  const [newDomainName, setNewDomainName] = useState('');
  const [isGlobalDomain, setIsGlobalDomain] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const currentPackage = packages.find(p => p.id === currentUser.packageId);

  // Check access for currentUser on a domain
  const getUserAccessStatus = (domain: CustomDomain) => {
    // 1. Check explicit denial
    const explicitPerm = permissions.find(p => p.userId === currentUser.id && p.domainId === domain.id);
    if (explicitPerm) {
      if (!explicitPerm.isAllowed) {
        return { allowed: false, label: language === 'bn' ? 'অ্যাডমিন কর্তৃক অস্বীকৃত' : 'Admin Denied', color: 'text-rose-500 bg-rose-500/10' };
      }
      return { allowed: true, label: language === 'bn' ? 'স্পষ্ট অনুমতিপ্রাপ্ত' : 'Explicitly Allowed', color: 'text-emerald-500 bg-emerald-500/10' };
    }

    // 2. All-domains access
    if (currentUser.hasAllDomainsAccess || currentPackage?.hasAllDomainsAccess) {
      return { allowed: true, label: language === 'bn' ? 'আনলিমিটেড ডোমেইন এক্সেস' : 'Unlimited All-Domains', color: 'text-indigo-500 bg-indigo-500/10' };
    }

    // 3. User owner
    if (domain.userId === currentUser.id) {
      return { allowed: true, label: language === 'bn' ? 'আমার ডোমেইন' : 'Owner', color: 'text-blue-500 bg-blue-500/10' };
    }

    // 4. Global domain for paid users
    if (domain.isGlobal && currentUser.packageId !== 'pkg_free') {
      return { allowed: true, label: language === 'bn' ? 'গ্লোবাল পেইড এক্সেস' : 'Global Paid Access', color: 'text-emerald-500 bg-emerald-500/10' };
    }

    return { allowed: false, label: language === 'bn' ? 'প্যাকেজে অন্তর্ভুক্ত নয়' : 'Not In Package', color: 'text-slate-400 bg-slate-500/10' };
  };

  const handleVerify = (dom: CustomDomain) => {
    setVerifyingId(dom.id);
    setTimeout(() => {
      onVerifyDomain(dom.id);
      setVerifyingId(null);
    }, 1200);
  };

  const handleCreateDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;
    const cleanDomain = newDomainName.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    onAddDomain(cleanDomain, currentUser.role === 'admin' ? isGlobalDomain : false);
    setNewDomainName('');
    setIsGlobalDomain(false);
    setIsAddModalOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredDomains = domains.filter(d => {
    if (filter === 'verified') return d.isVerified;
    if (filter === 'pending') return !d.isVerified;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>{language === 'bn' ? 'কাস্টম ডোমেইন ম্যানেজমেন্ট' : 'Custom Branded Domains'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'শর্ট লিংক ডোমেইন ও ডিএনএস ভেরিফিকেশন' : 'Custom Domains & DNS Verification'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'আপনার ব্র্যান্ডেড ডোমেইন যোগ করুন, ডিএনএস টিএক্সটি (DNS TXT) ভ্যালিডেশন দিয়ে ভেরিফাই করুন এবং অনুমোদিত ডোমেইন নির্বাচন করে লিংক তৈরি করুন।' 
              : 'Add your branded short domains, verify ownership via DNS TXT challenges, and manage user permissions.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন কাস্টম ডোমেইন যোগ করুন' : 'Add Custom Domain'}</span>
        </button>
      </div>

      {/* Info Notice Box */}
      <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
        darkMode ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
      }`}>
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">{language === 'bn' ? 'কঠোর নিরাপত্তা নীতি:' : 'Strict 5-Step Domain Authorization:'}</span>{' '}
          {language === 'bn' 
            ? 'শুধুমাত্র ভেরিফাইড ও সক্রিয় ডোমেইন ব্যবহার করা যাবে। অ্যাডমিন কর্তৃক নির্দিষ্ট ব্যবহারকারীর অ্যাক্সেস অনুমোদন বা অস্বীকৃতি (Explicit Denial) সাবস্ক্রিপশন প্যাকেজের উপরে কার্যকর হয়।'
            : 'Only verified, active domains with valid DNS TXT records can generate short URLs. User-level permissions and explicit admin denials strictly supersede package-level access.'}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
          }`}
        >
          {language === 'bn' ? 'সকল ডোমেইন' : 'All Domains'} ({domains.length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'verified' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
          }`}
        >
          {language === 'bn' ? 'সক্রিয় ও ভেরিফাইড' : 'Verified'} ({domains.filter(d => d.isVerified).length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'pending' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
          }`}
        >
          {language === 'bn' ? 'পেন্ডিং ভেরিফিকেশন' : 'Pending DNS'} ({domains.filter(d => !d.isVerified).length})
        </button>
      </div>

      {/* Domains Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 ${
                darkMode ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <th className="p-4">{language === 'bn' ? 'ডোমেইন নাম' : 'Domain Hostname'}</th>
                <th className="p-4">{language === 'bn' ? 'ভেরিফিকেশন স্ট্যাটাস' : 'Verification Status'}</th>
                <th className="p-4">{language === 'bn' ? 'আপনার অনুমতি' : 'Your Permission'}</th>
                <th className="p-4">{language === 'bn' ? 'মোট লিংক' : 'Links Created'}</th>
                <th className="p-4">{language === 'bn' ? 'এসএসএল (SSL)' : 'SSL Status'}</th>
                <th className="p-4 text-right">{language === 'bn' ? 'অ্যাকশনসমূহ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredDomains.map((dom) => {
                const userAccess = getUserAccessStatus(dom);
                return (
                  <tr key={dom.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm flex items-center space-x-2">
                            <span>{dom.domainName}</span>
                            {dom.isGlobal && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                Global
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 font-mono">
                            Added: {dom.createdAt.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      {dom.isVerified ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ভেরিফাইড' : 'Verified'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>{language === 'bn' ? 'পেন্ডিং ডিএনএস' : 'Pending DNS'}</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium ${userAccess.color}`}>
                        {userAccess.allowed ? <Unlock className="w-3.5 h-3.5 inline mr-1" /> : <Lock className="w-3.5 h-3.5 inline mr-1" />}
                        <span>{userAccess.label}</span>
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {dom.totalLinksCount} {language === 'bn' ? 'টি' : 'links'}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                        dom.sslActive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{dom.sslActive ? 'HTTPS Active' : 'No SSL'}</span>
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedDomainForDns(dom)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="View DNS Records Setup"
                      >
                        DNS Records
                      </button>

                      {!dom.isVerified && (
                        <button
                          onClick={() => handleVerify(dom)}
                          disabled={verifyingId === dom.id}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs inline-flex items-center space-x-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${verifyingId === dom.id ? 'animate-spin' : ''}`} />
                          <span>{verifyingId === dom.id ? 'Verifying...' : 'Verify DNS'}</span>
                        </button>
                      )}

                      {currentUser.role === 'admin' && dom.id !== 'dom_1' && (
                        <button
                          onClick={() => onDeleteDomain(dom.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Remove Domain"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DNS Instructions Modal */}
      {selectedDomainForDns && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-xl p-6 rounded-2xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold">
                  {language === 'bn' ? 'ডিএনএস কনফিগারেশন নির্দেশাবলী' : 'DNS Configuration Instructions'}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDomainForDns(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Add the following DNS records at your domain registrar (Namecheap, Cloudflare, GoDaddy) for <span className="font-bold text-indigo-400">{selectedDomainForDns.domainName}</span>:
            </p>

            {/* Record 1: TXT Record for Verification */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">1. DNS TXT Verification Challenge</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Mandatory</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Record Type</div>
                    <div className="font-bold text-indigo-300">TXT</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Host / Name</div>
                    <div className="font-bold text-indigo-300 truncate">{selectedDomainForDns.expectedDnsHost}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">TTL</div>
                    <div className="font-bold text-indigo-300">Auto / 3600</div>
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-950/90 border border-slate-800 flex items-center justify-between">
                  <div className="truncate text-xs font-mono text-emerald-400">{selectedDomainForDns.expectedDnsValue}</div>
                  <button
                    onClick={() => copyToClipboard(selectedDomainForDns.expectedDnsValue)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    {copiedText === selectedDomainForDns.expectedDnsValue ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Record 2: CNAME or A Record for Redirection */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">2. Traffic Routing Record (A or CNAME)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-400">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Record Type</div>
                    <div className="font-bold text-indigo-300">CNAME</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Host / Subdomain</div>
                    <div className="font-bold text-indigo-300">{selectedDomainForDns.domainName.split('.')[0]}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-500">Target</div>
                    <div className="font-bold text-indigo-300">lnk.pro</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDomainForDns(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium"
              >
                Close
              </button>
              {!selectedDomainForDns.isVerified && (
                <button
                  onClick={() => {
                    handleVerify(selectedDomainForDns);
                    setSelectedDomainForDns(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Verify Now via PHP PDO</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-1">
              {language === 'bn' ? 'কাস্টম শর্ট লিংক ডোমেইন যুক্ত করুন' : 'Add Custom Branded Domain'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter the domain or subdomain you wish to use for creating short links (e.g. go.yourcompany.com).
            </p>

            <form onSubmit={handleCreateDomain} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-400">
                  {language === 'bn' ? 'ডোমেইন বা সাবডোমেইন নাম' : 'Domain / Subdomain *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. short.mybrand.org"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {currentUser.role === 'admin' && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div>
                    <div className="text-xs font-semibold">Global Domain</div>
                    <div className="text-[10px] text-slate-400">Make available to all paid tier users</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isGlobalDomain}
                    onChange={(e) => setIsGlobalDomain(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-500/25"
                >
                  Save & Generate DNS Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
