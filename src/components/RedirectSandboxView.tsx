import React, { useState } from 'react';
import { LinkItem } from '../types';
import { ExternalLink, Zap, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface RedirectSandboxViewProps {
  links: LinkItem[];
  darkMode: boolean;
  language: 'bn' | 'en';
}

export const RedirectSandboxView: React.FC<RedirectSandboxViewProps> = ({
  links,
  darkMode,
  language
}) => {
  const [testCode, setTestCode] = useState('ghact99');
  const [redirecting, setRedirecting] = useState(false);
  const [matchedLink, setMatchedLink] = useState<LinkItem | null>(null);

  const handleTestRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const found = links.find(l => l.shortCode.toLowerCase() === testCode.trim().toLowerCase());
    setMatchedLink(found || null);
    setRedirecting(true);
    setTimeout(() => {
      setRedirecting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Zap className="w-4 h-4" />
          <span>{language === 'bn' ? 'সিঙ্গেল-স্টেপ রিডাইরেক্ট স্যান্ডবক্স' : 'Single-Step Direct Redirect Sandbox'}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'bn' ? 'লাইভ রিডাইরেক্ট পরীক্ষা করুন' : 'Test Instant 302 Redirection'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'bn' 
            ? 'কোনো মধ্যবর্তী ল্যান্ডিং পেজ বা বিজ্ঞাপন ছাড়া সরাসরি ডেস্টিনেশনে রিডাইরেক্ট হওয়ার প্রক্রিয়াটি পরীক্ষা করুন।'
            : 'Experience lightning-fast single-step 302 redirection with zero intermediate landing pages or advertisements.'}
        </p>
      </div>

      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <form onSubmit={handleTestRedirect} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-400">
              {language === 'bn' ? 'শর্ট কোড লিখুন' : 'Enter Short Code (e.g. ghact99, larv11, boot53)'}
            </label>
            <div className="flex space-x-2">
              <div className="flex items-center px-3.5 py-2.5 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-500">
                https://lnk.pro/
              </div>
              <input
                type="text"
                required
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none font-mono ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Test Redirect</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-400 self-center mr-2">Quick Test Links:</span>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => setTestCode(l.shortCode)}
              className="px-3 py-1 rounded-lg border text-xs font-mono bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
            >
              /{l.shortCode}
            </button>
          ))}
        </div>

        {redirecting && (
          <div className="mt-8 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto">
              <Zap className="w-4 h-4 animate-spin" />
            </div>
            <div className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm">
              HTTP 302 Found • Looking up short code in MariaDB & logging click async...
            </div>
          </div>
        )}

        {!redirecting && matchedLink && (
          <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Redirect Success (HTTP 302)</span>
            </div>
            <div className="text-xs space-y-1 font-mono text-slate-300">
              <div>Short Code: <span className="text-indigo-400">/{matchedLink.shortCode}</span></div>
              <div>Destination URL: <a href={matchedLink.originalUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline">{matchedLink.originalUrl}</a></div>
              <div>Click Count: <span className="text-emerald-400">{matchedLink.clicks + 1} clicks</span></div>
            </div>
            <a
              href={matchedLink.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md"
            >
              <span>Open Destination URL Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {!redirecting && matchedLink === null && testCode && !redirecting && (
          <div className="mt-8 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            HTTP 404 Not Found: Short code `/{testCode}` does not exist or has expired.
          </div>
        )}
      </div>
    </div>
  );
};
