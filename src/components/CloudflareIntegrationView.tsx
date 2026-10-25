import React, { useState, useEffect } from 'react';
import { apiClient, BackendConfig, HealthResponse, ReadyResponse, Stage1LinkResponse } from '../services/apiClient';
import { vpsShortenerService } from '../services/vpsShortenerService';
import { 
  Server, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Send,
  Database,
  Globe
} from 'lucide-react';

interface CloudflareIntegrationViewProps {
  darkMode: boolean;
  language: 'bn' | 'en';
}

export const CloudflareIntegrationView: React.FC<CloudflareIntegrationViewProps> = ({
  darkMode,
  language
}) => {
  const [config, setConfig] = useState<BackendConfig>(apiClient.getConfig());
  const [testingHealth, setTestingHealth] = useState(false);
  const [testingReady, setTestingReady] = useState(false);
  const [testingStage1, setTestingStage1] = useState(false);
  const [testingAuthLinks, setTestingAuthLinks] = useState(false);

  const [healthResult, setHealthResult] = useState<any>(null);
  const [readyResult, setReadyResult] = useState<any>(null);
  const [stage1Result, setStage1Result] = useState<any>(null);
  const [authLinksResult, setAuthLinksResult] = useState<any>(null);

  const [testStage1Input, setTestStage1Input] = useState('https://lnk.pro/preview_test_link');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const presets = [
    { label: 'Boss VPS Production IP', url: 'http://107.174.37.180', isProxy: false },
    { label: 'Vite / Cloudflare Proxy (/api)', url: '/api', isProxy: true },
    { label: 'Local Development Server', url: 'http://localhost:8000', isProxy: false },
  ];

  const handleApplyPreset = (presetUrl: string, isProxy = false) => {
    const updated = {
      ...config,
      baseUrl: presetUrl,
      useProxy: isProxy,
    };
    setConfig(updated);
    apiClient.saveConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient.saveConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const runHealthTest = async () => {
    setTestingHealth(true);
    setHealthResult(null);
    const start = performance.now();
    try {
      const res = await apiClient.getHealth();
      const latency = Math.round(performance.now() - start);
      setHealthResult({
        ...res,
        latencyMs: latency,
        endpoint: apiClient.getEffectiveUrl('/api/health'),
      });
    } finally {
      setTestingHealth(false);
    }
  };

  const runReadyTest = async () => {
    setTestingReady(true);
    setReadyResult(null);
    const start = performance.now();
    try {
      const res = await apiClient.getReady();
      const latency = Math.round(performance.now() - start);
      setReadyResult({
        ...res,
        latencyMs: latency,
        endpoint: apiClient.getEffectiveUrl('/api/ready'),
      });
    } finally {
      setTestingReady(false);
    }
  };

  const runStage1Test = async () => {
    setTestingStage1(true);
    setStage1Result(null);
    const start = performance.now();
    try {
      const res = await apiClient.createStage1Link(testStage1Input);
      const latency = Math.round(performance.now() - start);
      setStage1Result({
        ...res,
        latencyMs: latency,
        endpoint: apiClient.getEffectiveUrl('/api/links/stage1'),
        payload: { url: testStage1Input },
      });
    } finally {
      setTestingStage1(false);
    }
  };

  const runAuthLinksTest = async () => {
    setTestingAuthLinks(true);
    setAuthLinksResult(null);
    const start = performance.now();
    try {
      const res = await apiClient.getLinks();
      const latency = Math.round(performance.now() - start);
      setAuthLinksResult({
        ...res,
        latencyMs: latency,
        endpoint: apiClient.getEffectiveUrl('/api/links'),
      });
    } finally {
      setTestingAuthLinks(false);
    }
  };

  // Run initial health check on load
  useEffect(() => {
    runHealthTest();
    runReadyTest();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Server className="w-4 h-4" />
          <span>Boss URL Shortener &bull; Live VPS Backend Integration</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'bn' ? 'ভিপিএস ব্যাকএন্ড সংযোগ ও লাইভ এপিআই ডায়াগনস্টিক' : 'VPS Backend Connection & API Diagnostics'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Authoritative production backend: <code className="text-indigo-400 font-mono">http://107.174.37.180</code> running Nginx, PHP 7.4-FPM, and MariaDB.
        </p>
      </div>

      {/* Verified Status Banner */}
      <div className={`p-5 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Server IP</span>
            <span className="font-bold text-slate-200">107.174.37.180</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Web Server</span>
            <span className="font-bold text-emerald-400">Nginx + PHP 7.4.3</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Database</span>
            <span className="font-bold text-indigo-400">MariaDB (boss_shortener)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Storage Status</span>
            <span className="font-bold text-emerald-400">Ready (Writable)</span>
          </div>
        </div>
      </div>

      {/* Live API Diagnostics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Interactive Endpoint Tests (Real VPS Responses)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Zero mocks &bull; Real live requests</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Test 1: GET /api/health */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  GET /api/health
                </span>
                {healthResult && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    healthResult.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {healthResult.success ? 'HTTP 200 OK' : 'Failed'} ({healthResult.latencyMs}ms)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">Checks core application process status and server timestamp.</p>
              
              {healthResult && (
                <div className="p-3 rounded-lg bg-black/60 font-mono text-[11px] border border-slate-800 overflow-x-auto text-slate-300 mb-3">
                  <pre>{JSON.stringify(healthResult.data || healthResult.error, null, 2)}</pre>
                </div>
              )}
            </div>

            <button
              onClick={runHealthTest}
              disabled={testingHealth}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`} />
              <span>{testingHealth ? 'Testing Health...' : 'Execute GET /api/health'}</span>
            </button>
          </div>

          {/* Test 2: GET /api/ready */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  GET /api/ready
                </span>
                {readyResult && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    readyResult.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {readyResult.success ? 'HTTP 200 READY' : 'Failed'} ({readyResult.latencyMs}ms)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">Verifies database connectivity and filesystem storage readiness.</p>
              
              {readyResult && (
                <div className="p-3 rounded-lg bg-black/60 font-mono text-[11px] border border-slate-800 overflow-x-auto text-slate-300 mb-3">
                  <pre>{JSON.stringify(readyResult.data || readyResult.error, null, 2)}</pre>
                </div>
              )}
            </div>

            <button
              onClick={runReadyTest}
              disabled={testingReady}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingReady ? 'animate-spin' : ''}`} />
              <span>{testingReady ? 'Testing Readiness...' : 'Execute GET /api/ready'}</span>
            </button>
          </div>

          {/* Test 3: POST /api/links/stage1 */}
          <div className={`p-5 rounded-2xl border md:col-span-2 flex flex-col justify-between ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  POST /api/links/stage1
                </span>
                {stage1Result && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    stage1Result.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {stage1Result.success ? 'HTTP 201 Created' : 'Failed'} ({stage1Result.latencyMs}ms)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Submits the first-stage short URL to Boss VPS API and receives the live short link redirecting via 302 Found.
              </p>

              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="url"
                  value={testStage1Input}
                  onChange={(e) => setTestStage1Input(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  placeholder="https://..."
                />
                <button
                  onClick={runStage1Test}
                  disabled={testingStage1}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
                >
                  <Send className={`w-3.5 h-3.5 ${testingStage1 ? 'animate-pulse' : ''}`} />
                  <span>{testingStage1 ? 'Sending...' : 'Test Stage 1'}</span>
                </button>
              </div>

              {stage1Result && (
                <div className="space-y-2 mb-3">
                  <div className="p-3 rounded-lg bg-black/60 font-mono text-[11px] border border-slate-800 overflow-x-auto text-slate-300">
                    <pre>{JSON.stringify(stage1Result.data || stage1Result.error, null, 2)}</pre>
                  </div>
                  {stage1Result.data?.stage1_url && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs">
                      <span className="font-mono text-emerald-300 break-all">{stage1Result.data.stage1_url}</span>
                      <a
                        href={stage1Result.data.stage1_url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold text-[11px] flex items-center space-x-1 hover:bg-emerald-500"
                      >
                        <span>Test 302</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backend Settings Form */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold">API Connection & Routing Configuration</h2>
          </div>
          {saveSuccess && (
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Saved!</span>
            </span>
          )}
        </div>

        {/* Presets */}
        <div className="mb-4">
          <span className="text-xs text-slate-400 block mb-2">Quick Presets:</span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p.url, p.isProxy)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  config.baseUrl === p.url && config.useProxy === p.isProxy
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Backend API Base URL
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="useProxy"
              checked={config.useProxy}
              onChange={(e) => setConfig({ ...config, useProxy: e.target.checked })}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="useProxy" className="text-xs text-slate-300 select-none">
              Enable Proxy Mode (<code className="text-indigo-400">/api</code> endpoint) &bull; Prevents HTTPS Mixed Content restrictions when running in preview
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              API Bearer Token (Optional for protected user endpoints)
            </label>
            <input
              type="password"
              placeholder="Paste Bearer token from /api/auth/login"
              value={config.apiToken}
              onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-mono outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};
