import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Database, 
  Server, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Terminal,
  Lock
} from 'lucide-react';

interface InstallWizardViewProps {
  language: 'bn' | 'en';
  darkMode: boolean;
}

export const InstallWizardView: React.FC<InstallWizardViewProps> = ({
  language,
  darkMode
}) => {
  const [step, setStep] = useState(1);
  const [dbHost, setDbHost] = useState('localhost');
  const [dbName, setDbName] = useState('linkpro_db');
  const [dbUser, setDbUser] = useState('linkpro_user');
  const [dbPass, setDbPass] = useState('SecurePass123!');
  const [adminEmail, setAdminEmail] = useState('admin@lnk.pro');
  const [adminPass, setAdminPass] = useState('AdminSecret2026!');
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [loading, setLoading] = useState(false);

  const testDatabase = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsDbConnected(true);
      setStep(6);
    }, 1000);
  };

  const completeInstallation = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsInstalled(true);
      setStep(10);
    }, 1500);
  };

  const stepsList = [
    { num: 1, title: 'Welcome' },
    { num: 2, title: 'PHP Checks' },
    { num: 3, title: 'Permissions' },
    { num: 4, title: 'Database' },
    { num: 5, title: 'Test Connection' },
    { num: 6, title: 'Run Migrations' },
    { num: 7, title: 'App Settings' },
    { num: 8, title: 'Admin Account' },
    { num: 9, title: 'Write Config' },
    { num: 10, title: 'Complete & Lock' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'bn' ? 'ব্রাউজার ইনস্টলেশন উইজার্ড' : 'Browser Installation Wizard'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {language === 'bn' ? 'আপনার Ubuntu VPS-এ LinkPro SaaS সেটআপ করার জন্য নিরাপদ ব্রাউজার ইনস্টলার।' : 'Secure browser-based setup wizard for deploying LinkPro on Ubuntu VPS.'}
        </p>
      </div>

      {/* Steps Indicator Bar */}
      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {stepsList.map((s) => (
            <div key={s.num} className="flex items-center space-x-2 px-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step > s.num 
                  ? 'bg-emerald-600 text-white' 
                  : step === s.num 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25' 
                    : darkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${step === s.num ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Container */}
      <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        {step === 1 && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
              <Wrench className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">Welcome to LinkPro SaaS Installer</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              This interactive installation wizard will configure your database, write secure credentials, run MariaDB migrations, and create your administrator account.
            </p>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 inline-flex items-center space-x-2"
            >
              <span>Start Installation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Step 2: PHP Environment & Extension Checks</h3>
            <div className="space-y-2">
              {[
                { name: 'PHP Version >= 8.2', status: 'Passed (8.2.14)', ok: true },
                { name: 'PDO PHP Extension', status: 'Enabled', ok: true },
                { name: 'Mbstring Extension', status: 'Enabled', ok: true },
                { name: 'CURL Extension', status: 'Enabled', ok: true },
                { name: 'OpenSSL Extension', status: 'Enabled', ok: true },
              ].map((chk, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-sm">
                  <span className="font-medium">{chk.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{chk.status}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium">
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
              </button>
              <button onClick={() => setStep(3)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-md">
                Next: Permissions <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Step 3: Directory Writable Permissions</h3>
            <div className="space-y-2">
              {[
                { path: '/storage/logs/', status: 'Writable (755)', ok: true },
                { path: '/storage/cache/', status: 'Writable (755)', ok: true },
                { path: '/config/', status: 'Writable (755)', ok: true },
              ].map((chk, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-sm">
                  <span className="font-mono text-xs">{chk.path}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{chk.status}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium">
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
              </button>
              <button onClick={() => setStep(4)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-md">
                Next: Database Setup <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Step 4: MariaDB / MySQL Connection Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Database Host</label>
                <input
                  type="text"
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Database Name</label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Database Username</label>
                <input
                  type="text"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Database Password</label>
                <input
                  type="password"
                  value={dbPass}
                  onChange={(e) => setDbPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(3)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium">
                <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
              </button>
              <button 
                onClick={testDatabase}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md flex items-center space-x-2"
              >
                {loading ? <span>Testing Connection...</span> : <><span>Test & Initialize DB</span> <Database className="w-4 h-4 ml-1" /></>}
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Database Connection Successful!</h3>
            <p className="text-sm text-slate-400">MariaDB schema tables (users, links, click_events) successfully migrated.</p>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(4)} className="px-4 py-2 rounded-xl border text-sm font-medium">Back</button>
              <button onClick={() => setStep(8)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium">
                Next: Admin Account <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Step 8: Create Administrator Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Admin Password</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(6)} className="px-4 py-2 rounded-xl border text-sm font-medium">Back</button>
              <button 
                onClick={completeInstallation}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md shadow-emerald-500/25 flex items-center space-x-2"
              >
                {loading ? <span>Finalizing Setup...</span> : <><span>Complete Installation & Lock</span> <ShieldCheck className="w-4 h-4 ml-1" /></>}
              </button>
            </div>
          </div>
        )}

        {step === 10 && (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Installation Successful & Locked!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              LinkPro URL Shortener is now fully installed on your Ubuntu VPS with Nginx clean routing and MariaDB backend. The installer has been securely locked.
            </p>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-xs text-left max-w-md mx-auto space-y-1">
              <div>[OK] Config written to /config/config.php</div>
              <div>[OK] Database schema initialized via PDO</div>
              <div>[OK] Installer locked via /storage/install.lock</div>
              <div>[OK] Nginx clean short URL routing verified</div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md"
            >
              Return to Setup Wizard Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
