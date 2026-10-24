import React, { useState, useEffect } from 'react';
import { apiClient, BackendConfig } from '../services/apiClient';
import { vpsShortenerService } from '../services/vpsShortenerService';
import { 
  Cloud, 
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
  ArrowRight,
  Code2,
  Send,
  HelpCircle
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
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    reachable: boolean;
    latencyMs: number;
    url: string;
    details?: any;
    error?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stage 2 /shorten.php Diagnostics State
  const [mockFallbackActive, setMockFallbackActive] = useState<boolean>(vpsShortenerService.isMockFallbackEnabled());
  const [stage2Testing, setStage2Testing] = useState(false);
  const [testStage1Url, setTestStage1Url] = useState('https://lnk.pro/preview_test');
  const [testOriginalUrl, setTestOriginalUrl] = useState('https://github.com/torvalds/linux');
  const [stage2TestResult, setStage2TestResult] = useState<{
    reachable: boolean;
    latencyMs: number;
    requestPayload: any;
    responseStatus?: number;
    responseBody?: any;
    error?: string;
  } | null>(null);

  const presets = [
    { label: 'Production API Domain', url: 'https://api.lnk.pro' },
    { label: 'Direct Ubuntu VPS IP', url: 'http://142.93.120.45' },
    { label: 'Cloudflare Pages Proxy', url: '/api', isProxy: true },
    { label: 'Local PHP Dev Server', url: 'http://localhost:8000' },
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

  const runTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiClient.ping();
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  const toggleMockFallback = (enabled: boolean) => {
    vpsShortenerService.setMockFallbackEnabled(enabled);
    setMockFallbackActive(enabled);
  };

  const runStage2Test = async () => {
    setStage2Testing(true);
    setStage2TestResult(null);
    try {
      const res = await vpsShortenerService.testVpsShortenEndpoint(testStage1Url, testOriginalUrl);
      setStage2TestResult(res);
    } finally {
      setStage2Testing(false);
    }
  };

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const nginxCorsSnippet = `# Add inside your existing Nginx server block on Ubuntu VPS
# /etc/nginx/sites-available/linkpro

location /api/ {
    # Allow requests from your Cloudflare Pages frontend domain
    if ($http_origin ~* "^https://.*\\.pages\\.dev$|^https://(lnk\\.pro|app\\.lnk\\.pro)$") {
        add_header "Access-Control-Allow-Origin" "$http_origin" always;
        add_header "Access-Control-Allow-Methods" "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header "Access-Control-Allow-Headers" "Authorization, Content-Type, Accept, X-Requested-With" always;
        add_header "Access-Control-Allow-Credentials" "true" always;
        add_header "Access-Control-Max-Age" "86400" always;
    }

    # Respond instantly to browser preflight OPTIONS requests
    if ($request_method = "OPTIONS") {
        return 204;
    }

    try_files $uri $uri/ /index.php?$query_string;
}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Cloud className="w-4 h-4" />
          <span>{language === 'bn' ? 'ক্লাউডফ্লেয়ার ও ভিপিএস ইন্টিগ্রেশন' : 'Cloudflare Frontend + VPS Backend Integration'}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'bn' ? 'ক্লাউডফ্লেয়ার পেজেস ও উবুন্টু ব্যাকএন্ড কানেক্টিভিটি' : 'Cloudflare Pages & Ubuntu Backend Connectivity'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'bn'
            ? 'ক্লাউডফ্লেয়ারে হোস্ট করা ফ্রন্টএন্ড এবং উবুন্টু ভিপিএস-এ চলমান অথরিটেটিভ পিএইচপি/এনজিন্ড/মারিয়াডিবি ব্যাকএন্ডের মধ্যে সংযোগ পরিচালনা করুন।'
            : 'Configure and test the authoritative connection between this Cloudflare Pages frontend and your existing PHP/Nginx/MariaDB backend on Ubuntu VPS.'}
        </p>
      </div>

      {/* Connectivity Status Banner */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">Authoritative Backend Endpoint:</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {config.useProxy ? 'Cloudflare Edge Proxy (/api)' : config.baseUrl}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                All short codes, domain validation, rate limiting, and 302 redirects are generated directly by your VPS.
              </p>
            </div>
          </div>

          <button
            onClick={runTestConnection}
            disabled={testing}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing Endpoint...' : 'Test Backend Connection'}</span>
          </button>
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div className={`mt-4 p-4 rounded-xl border text-xs font-mono space-y-2 animate-fadeIn ${
            testResult.reachable 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold">
                {testResult.reachable ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <span>{testResult.reachable ? 'HTTP 200 OK — Backend Connected Successfully' : 'Connection Failed'}</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-black/40">
                Latency: {testResult.latencyMs} ms
              </span>
            </div>
            <div className="text-[11px] opacity-80">
              Target: {testResult.url}
            </div>
            {testResult.error && (
              <div className="p-2 rounded bg-black/40 text-rose-400 text-[11px]">
                Error: {testResult.error}
              </div>
            )}
            {testResult.details && (
              <div className="p-2 rounded bg-black/40 text-emerald-300 text-[11px] truncate">
                Payload: {JSON.stringify(testResult.details)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Backend Settings Configuration */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Backend Connection Settings</h2>
          </div>
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>Settings Saved!</span>
            </span>
          )}
        </div>

        {/* Presets */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1.5 text-slate-400">Quick Endpoint Presets</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p.url, p.isProxy)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                  config.baseUrl === p.url && config.useProxy === (p.isProxy || false)
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-400">
                Authoritative VPS API Base URL
              </label>
              <input
                type="text"
                required
                value={config.baseUrl}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder="https://api.lnk.pro or http://YOUR_VPS_IP"
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-800 border-slate-700 text-sm font-mono text-white outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                The origin hosting your PHP index.php & redirect.php.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-slate-400">
                API Bearer Token (Optional Service Auth)
              </label>
              <input
                type="password"
                value={config.apiToken}
                onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                placeholder="Leave blank for session/cookie auth"
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-800 border-slate-700 text-sm font-mono text-white outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Passed in the <code className="text-indigo-400">Authorization: Bearer &lt;token&gt;</code> header.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
            <div>
              <div className="text-xs font-semibold text-slate-200">Use Cloudflare Pages Edge Proxy (/api/*)</div>
              <div className="text-[11px] text-slate-400">
                Routes API requests through Cloudflare Workers to bypass browser CORS and mask VPS origin IP.
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.useProxy}
              onChange={(e) => setConfig({ ...config, useProxy: e.target.checked })}
              className="w-5 h-5 accent-indigo-600 rounded"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-500/25"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Stage 2 VPS /shorten.php Diagnostic Suite */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="text-base font-bold">
                {language === 'bn' ? 'স্টেজ ২ ভিপিএস shorten.php ডায়াগনস্টিক টেস্ট' : 'Stage 2 VPS /shorten.php Diagnostic Tester'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' 
                  ? 'উবুন্টু ভিপিএস-এ { short_url, original_url } পেলোড পাঠিয়ে টেস্ট করুন।' 
                  : 'Directly dispatch { short_url, original_url } to your Ubuntu VPS endpoint and verify error: 0 response.'}
              </p>
            </div>
          </div>

          {/* Mock Fallback Toggle */}
          <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700 text-xs">
            <div className="text-[11px] text-slate-300">
              <span className="font-semibold">Local Offline Mock:</span>{' '}
              <span className={mockFallbackActive ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                {mockFallbackActive ? 'Active' : 'Disabled (Live VPS Enforced)'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={mockFallbackActive}
              onChange={(e) => toggleMockFallback(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              title="Toggle mock fallback for testing without VPS"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-400">
              Stage 1 Short URL (short_url field)
            </label>
            <input
              type="url"
              value={testStage1Url}
              onChange={(e) => setTestStage1Url(e.target.value)}
              placeholder="https://lnk.pro/preview_test"
              className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-xs font-mono text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-slate-400">
              Original Long Destination URL (original_url field)
            </label>
            <input
              type="url"
              value={testOriginalUrl}
              onChange={(e) => setTestOriginalUrl(e.target.value)}
              placeholder="https://github.com/torvalds/linux"
              className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-xs font-mono text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            POST {config.useProxy ? `${config.proxyEndpoint}/shorten.php` : `${config.baseUrl}/shorten.php`}
          </div>

          <button
            type="button"
            onClick={runStage2Test}
            disabled={stage2Testing}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-500/25 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${stage2Testing ? 'animate-bounce' : ''}`} />
            <span>{stage2Testing ? 'Dispatching to VPS...' : 'Test POST /shorten.php'}</span>
          </button>
        </div>

        {/* Stage 2 Test Result View */}
        {stage2TestResult && (
          <div className={`mt-4 p-4 rounded-xl border text-xs font-mono space-y-2 animate-fadeIn ${
            stage2TestResult.reachable 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold">
                {stage2TestResult.reachable ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {stage2TestResult.reachable 
                    ? `HTTP ${stage2TestResult.responseStatus || 200} OK — Stage 2 Validated` 
                    : `Stage 2 Endpoint Test Failed`}
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-black/40">
                Latency: {stage2TestResult.latencyMs} ms
              </span>
            </div>

            {/* Request Payload Sent */}
            <div className="p-2.5 rounded bg-black/50 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Sent JSON Request:</div>
              <pre className="text-[11px] text-indigo-300 overflow-x-auto">
                {JSON.stringify(stage2TestResult.requestPayload, null, 2)}
              </pre>
            </div>

            {/* Received Response */}
            <div className="p-2.5 rounded bg-black/50 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Received VPS Response:</div>
              <pre className="text-[11px] overflow-x-auto text-emerald-300">
                {typeof stage2TestResult.responseBody === 'object'
                  ? JSON.stringify(stage2TestResult.responseBody, null, 2)
                  : String(stage2TestResult.responseBody || stage2TestResult.error)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Cloudflare Pages Edge Function Code */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Cloudflare Pages Edge Proxy (functions/api/[[route]].ts)</h2>
          </div>
          <button
            onClick={() => copyCode(`// Cloudflare Pages Function Proxy\n// Located at /functions/api/[[route]].ts`, 'cf_edge')}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700 flex items-center space-x-1.5"
          >
            {copiedKey === 'cf_edge' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'cf_edge' ? 'Copied' : 'Copy Proxy Code'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          This edge function is committed in <code className="text-indigo-400">functions/api/[[route]].ts</code>. When deployed to Cloudflare Pages, it intercepts all calls to <code className="text-indigo-400">/api/*</code> and securely relays them to your Ubuntu VPS backend.
        </p>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto max-h-56">
          <code>{`export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const backendBaseUrl = (env.BACKEND_API_URL || 'https://api.lnk.pro').replace(/\\/+$/, '');
  const targetUrl = new URL(\`\${backendBaseUrl}\${url.pathname}\${url.search}\`);

  // Forward request with origin IP & Host headers
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
  forwardHeaders.set('Host', new URL(backendBaseUrl).hostname);

  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: forwardHeaders,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers
  });
};`}</code>
        </pre>
      </div>

      {/* Ubuntu VPS Nginx CORS Block */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Ubuntu VPS Nginx CORS Configuration</h2>
          </div>
          <button
            onClick={() => copyCode(nginxCorsSnippet, 'nginx_cors')}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700 flex items-center space-x-1.5"
          >
            {copiedKey === 'nginx_cors' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'nginx_cors' ? 'Copied' : 'Copy Nginx Block'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          If calling the backend directly from the browser (without the Cloudflare Edge proxy), ensure your VPS Nginx server block contains these CORS headers:
        </p>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto max-h-56">
          <code>{nginxCorsSnippet}</code>
        </pre>
      </div>

      {/* Cloudflare Deployment Step-by-Step */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h2 className="text-base font-bold mb-3">Cloudflare Deployment Commands (Pages &amp; Workers)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300">
            <div className="text-emerald-400 font-semibold mb-1">Option A: Cloudflare Workers (Assets)</div>
            <div className="text-slate-500"># 1. Build and deploy via Wrangler</div>
            <div className="text-indigo-400">npm run build</div>
            <div className="text-indigo-400">npx wrangler deploy</div>
            <div className="text-slate-500 mt-2"># 2. Set backend VPS secret</div>
            <div className="text-indigo-400">npx wrangler secret put BACKEND_API_URL</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300">
            <div className="text-cyan-400 font-semibold mb-1">Option B: Cloudflare Pages</div>
            <div className="text-slate-500"># 1. Build frontend dist</div>
            <div className="text-indigo-400">npm run build</div>
            <div className="text-slate-500 mt-2"># 2. Deploy to Pages with functions proxy</div>
            <div className="text-indigo-400">npx wrangler pages deploy dist --project-name=linkpro-enterprise-frontend</div>
            <div className="text-slate-500 mt-2"># 3. Set backend secret in Pages</div>
            <div className="text-indigo-400">npx wrangler pages secret put BACKEND_API_URL</div>
          </div>
        </div>
      </div>
    </div>
  );
};
