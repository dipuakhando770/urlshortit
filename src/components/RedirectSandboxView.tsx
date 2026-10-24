import React, { useState } from 'react';
import { LinkItem, CustomDomain } from '../types';
import { ExternalLink, Zap, ArrowRight, Play, CheckCircle2, Globe, ShieldCheck, AlertCircle } from 'lucide-react';

interface RedirectSandboxViewProps {
  links: LinkItem[];
  domains: CustomDomain[];
  darkMode: boolean;
  language: 'bn' | 'en';
}

export const RedirectSandboxView: React.FC<RedirectSandboxViewProps> = ({
  links,
  domains,
  darkMode,
  language
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState(domains[0]?.id || 'dom_1');
  const [testCode, setTestCode] = useState('ghact99');
  const [redirecting, setRedirecting] = useState(false);
  const [matchedLink, setMatchedLink] = useState<LinkItem | null>(null);
  const [tested, setTested] = useState(false);

  const selectedDomain = domains.find(d => d.id === selectedDomainId) || domains[0];

  const handleTestRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    setTested(true);
    setRedirecting(true);

    const found = links.find(l => 
      l.domainId === selectedDomain.id && 
      l.shortCode.toLowerCase() === testCode.trim().toLowerCase()
    );

    setTimeout(() => {
      setMatchedLink(found || null);
      setRedirecting(false);
    }, 800);
  };

  const domainLinks = links.filter(l => l.domainId === selectedDomain.id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Zap className="w-4 h-4" />
          <span>{language === 'bn' ? 'মাল্টি-ডোমেইন ডাইরেক্ট রিডাইরেক্ট স্যান্ডবক্স' : 'Multi-Domain Direct 302 Redirection Engine'}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'bn' ? 'কাস্টম ডোমেইন রিডাইরেক্ট সিমুলেটর' : 'Test Multi-Tenant 302 Redirection'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'bn' 
            ? 'বিভিন্ন কাস্টম ডোমেইন ও শর্ট কোড নির্বাচন করে সরাসরি 302 রিডাইরেক্ট পরীক্ষা করুন। কোনো মধ্যবর্তী ল্যান্ডিং পেজ বা বিজ্ঞাপন ছাড়াই।'
            : 'Test how Nginx extracts the request HTTP_HOST and looks up the unique (domain_id + short_code) tuple to dispatch an instant single-step 302 redirect.'}
        </p>
      </div>

      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <form onSubmit={handleTestRedirect} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Domain Dropdown */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium mb-1.5 text-slate-400">
                Incoming Hostname
              </label>
              <select
                value={selectedDomainId}
                onChange={(e) => {
                  setSelectedDomainId(e.target.value);
                  setTested(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none font-mono ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {domains.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.domainName}
                  </option>
                ))}
              </select>
            </div>

            {/* Path / Code */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1.5 text-slate-400">
                Short Code Path (e.g. /{testCode})
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. ghact99 or larv11"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-500/25 flex items-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick Links on this domain */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Available short codes registered on <span className="text-indigo-400">{selectedDomain.domainName}</span>:
          </div>
          <div className="flex flex-wrap gap-2">
            {domainLinks.length === 0 ? (
              <span className="text-xs text-slate-500">No active links created under this domain yet.</span>
            ) : (
              domainLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setTestCode(l.shortCode);
                    setTested(false);
                  }}
                  className="px-3 py-1 rounded-lg border text-xs font-mono bg-slate-800/80 border-slate-700 text-indigo-300 hover:border-indigo-500 transition-colors"
                >
                  /{l.shortCode}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Simulating Execution */}
        {redirecting && (
          <div className="mt-6 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto">
              <Zap className="w-4 h-4 animate-spin" />
            </div>
            <div className="font-semibold text-indigo-400 text-xs font-mono">
              [Nginx FastCGI] → Host: {selectedDomain.domainName} | Path: /{testCode} | Checking MariaDB compound index...
            </div>
          </div>
        )}

        {/* Results */}
        {!redirecting && tested && matchedLink && (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>HTTP 302 Found (Single-Step Direct Redirection)</span>
              </div>
              <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                Latency &lt; 2ms
              </span>
            </div>

            <div className="text-xs space-y-1.5 font-mono text-slate-300 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div><span className="text-slate-500">HTTP Status:</span> <span className="text-emerald-400 font-bold">302 Found</span></div>
              <div><span className="text-slate-500">Request Host:</span> <span className="text-indigo-400">{matchedLink.domainName}</span></div>
              <div><span className="text-slate-500">Location Header:</span> <span className="text-emerald-300 underline break-all">{matchedLink.originalUrl}</span></div>
              <div><span className="text-slate-500">X-Redirected-By:</span> LinkPro Enterprise multi-tenant</div>
              <div><span className="text-slate-500">Click Tracking:</span> Logged asynchronously to \`click_events\` table</div>
            </div>

            <a
              href={matchedLink.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-md"
            >
              <span>Follow Location Header Directly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {!redirecting && tested && matchedLink === null && (
          <div className="mt-6 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold">HTTP 404 Not Found</div>
              <div className="text-[11px] text-rose-300 mt-0.5">
                No active link exists for short code <span className="font-mono">/{testCode}</span> on hostname <span className="font-mono">{selectedDomain.domainName}</span>.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
