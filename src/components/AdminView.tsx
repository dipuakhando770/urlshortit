import React, { useState } from 'react';
import { UserProfile, AppSettings, AuditLog } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Settings, 
  FileText, 
  Lock, 
  Check, 
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX
} from 'lucide-react';

interface AdminViewProps {
  users: UserProfile[];
  settings: AppSettings;
  auditLogs: AuditLog[];
  onUpdateSettings: (newSettings: AppSettings) => void;
  darkMode: boolean;
  language: 'bn' | 'en';
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  settings,
  auditLogs,
  onUpdateSettings,
  darkMode,
  language
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'settings' | 'logs'>('users');
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(currentSettings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'bn' ? 'অ্যাডমিন কনসোল' : 'Administrator Control Panel'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'সিস্টেম অ্যাডমিনিস্ট্রেশন' : 'System Administration'}
          </h1>
        </div>

        {/* Sub Tabs */}
        <div className={`flex items-center p-1 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'settings' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'logs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Users Management */}
      {activeSubTab === 'users' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Registered Users & Permissions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 flex items-center space-x-3">
                      <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold">{usr.name}</div>
                        <div className="text-xs text-slate-400">{usr.email}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-500 capitalize">
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 capitalize">
                        {usr.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-400">{usr.createdAt.split(' ')[0]}</td>
                    <td className="py-3 text-right space-x-2">
                      <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs hover:bg-slate-100 dark:hover:bg-slate-800">
                        {usr.status === 'active' ? <UserX className="w-3.5 h-3.5 text-rose-500" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Management */}
      {activeSubTab === 'settings' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Application Global Settings</h2>
          </div>

          {savedMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              Settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-400">Site Name</label>
              <input
                type="text"
                value={currentSettings.siteName}
                onChange={(e) => setCurrentSettings({...currentSettings, siteName: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-slate-400">Base Domain / URL</label>
              <input
                type="text"
                value={currentSettings.baseUrl}
                onChange={(e) => setCurrentSettings({...currentSettings, baseUrl: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Default Redirect Type</label>
                <select
                  value={currentSettings.defaultRedirectType}
                  onChange={(e) => setCurrentSettings({...currentSettings, defaultRedirectType: e.target.value as '301' | '302'})}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                >
                  <option value="302">302 Temporary Redirect (Recommended)</option>
                  <option value="301">301 Permanent Redirect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-slate-400">Rate Limit (Requests / Min)</label>
                <input
                  type="number"
                  value={currentSettings.rateLimitPerMin}
                  onChange={(e) => setCurrentSettings({...currentSettings, rateLimitPerMin: Number(e.target.value)})}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div>
                <div className="font-semibold text-sm">Allow Public User Registration</div>
                <div className="text-xs text-slate-400">Allow new visitors to register accounts on the platform.</div>
              </div>
              <input
                type="checkbox"
                checked={currentSettings.allowRegistration}
                onChange={(e) => setCurrentSettings({...currentSettings, allowRegistration: e.target.checked})}
                className="w-5 h-5 accent-indigo-600 rounded"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Audit Logs */}
      {activeSubTab === 'logs' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Security & Activity Audit Logs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Action Performed</th>
                  <th className="pb-3">IP Address</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                    <td className="py-3 font-semibold">{log.userName}</td>
                    <td className="py-3 text-slate-300">{log.action}</td>
                    <td className="py-3 font-mono text-indigo-400">{log.ip}</td>
                    <td className="py-3 text-slate-400">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
