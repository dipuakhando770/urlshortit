import React, { useState } from 'react';
import { 
  UserProfile, 
  AppSettings, 
  AuditLog, 
  CustomDomain, 
  PackageTier, 
  OrderRecord, 
  UserDomainPermission 
} from '../types';
import { 
  ShieldAlert, 
  Users, 
  Settings, 
  FileText, 
  Lock, 
  Check, 
  Globe, 
  Package, 
  Receipt, 
  CheckCircle2, 
  XCircle, 
  Unlock, 
  UserX, 
  UserCheck, 
  RefreshCw,
  Plus,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';

interface AdminViewProps {
  users: UserProfile[];
  domains: CustomDomain[];
  packages: PackageTier[];
  orders: OrderRecord[];
  permissions: UserDomainPermission[];
  settings: AppSettings;
  auditLogs: AuditLog[];
  darkMode: boolean;
  language: 'bn' | 'en';
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdateUserStatus: (userId: string, newStatus: 'active' | 'suspended') => void;
  onToggleUserAllDomains: (userId: string) => void;
  onSetUserDomainPermission: (userId: string, domainId: string, isAllowed: boolean) => void;
  onVerifyDomain: (domainId: string) => void;
  onApproveOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  domains,
  packages,
  orders,
  permissions,
  settings,
  auditLogs,
  darkMode,
  language,
  onUpdateSettings,
  onUpdateUserStatus,
  onToggleUserAllDomains,
  onSetUserDomainPermission,
  onVerifyDomain,
  onApproveOrder,
  onRejectOrder
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'domains' | 'packages' | 'orders' | 'settings' | 'logs'>('users');
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<UserProfile | null>(null);
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const pendingOrders = orders.filter(o => o.status === 'pending_review');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(currentSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'bn' ? 'মাস্টার অ্যাডমিনিস্ট্রেশন কনসোল' : 'Master Administrator Console'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'সিস্টেম অ্যাডমিনিস্ট্রেশন ও পারমিশন কন্ট্রোল' : 'SaaS Administration & Access Control'}
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className={`flex flex-wrap gap-1 p-1 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('domains')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'domains' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Domains ({domains.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders
            {pendingOrders.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                {pendingOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'packages' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Packages
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Tab 1: Users & Domain Permissions */}
      {activeTab === 'users' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold">User Accounts & Domain Allowlist Management</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="pb-3">User & Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Package Tier</th>
                  <th className="pb-3">All-Domains VIP</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((u) => {
                  const pkg = packages.find(p => p.id === u.packageId);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                      <td className="py-3 flex items-center space-x-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-slate-200">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </td>

                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 uppercase">
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 font-semibold text-indigo-400">
                        {pkg?.name || 'Free'} Plan
                      </td>

                      <td className="py-3">
                        <button
                          onClick={() => onToggleUserAllDomains(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                            u.hasAllDomainsAccess 
                              ? 'bg-purple-600 text-white border-purple-500' 
                              : darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
                          }`}
                        >
                          {u.hasAllDomainsAccess ? 'ENABLED (All Domains)' : 'Disabled'}
                        </button>
                      </td>

                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedUserForPerms(u)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 font-medium transition-all"
                        >
                          Permissions Matrix
                        </button>

                        <button
                          onClick={() => onUpdateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                          className={`p-1.5 rounded-lg border text-xs transition-all ${
                            u.status === 'active' 
                              ? 'text-rose-400 border-rose-500/20 hover:bg-rose-500/10' 
                              : 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
                          }`}
                          title={u.status === 'active' ? 'Suspend User' : 'Reactivate User'}
                        >
                          {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Custom Domains Management */}
      {activeTab === 'domains' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold">All Platform Custom Domains</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Verification</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Links</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {domains.map((dom) => (
                  <tr key={dom.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                    <td className="py-3 font-semibold text-slate-200">{dom.domainName}</td>
                    <td className="py-3">
                      {dom.isGlobal ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Global Paid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400">
                          Private
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {dom.isVerified ? (
                        <span className="text-emerald-400 flex items-center space-x-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Pending DNS</span>
                      )}
                    </td>
                    <td className="py-3 capitalize text-slate-300">{dom.status}</td>
                    <td className="py-3 font-semibold">{dom.totalLinksCount}</td>
                    <td className="py-3 text-right">
                      {!dom.isVerified && (
                        <button
                          onClick={() => onVerifyDomain(dom.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs"
                        >
                          Force Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Orders & Manual Payment Approvals */}
      {activeTab === 'orders' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold">Payment Review & Manual MFS Approvals</h2>
            </div>
            {pendingOrders.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {pendingOrders.length} Pending Review
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Package</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method & Trx ID</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                    <td className="py-3 font-mono text-indigo-400 font-bold">{ord.orderNumber}</td>
                    <td className="py-3 font-medium">{ord.userName}</td>
                    <td className="py-3">{ord.packageName}</td>
                    <td className="py-3 font-bold text-slate-200">${ord.amount}</td>
                    <td className="py-3">
                      <div className="font-mono text-slate-300">{ord.transactionReference}</div>
                      <div className="text-[10px] text-slate-500">{ord.receiptNotes}</div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1.5">
                      {ord.status === 'pending_review' ? (
                        <>
                          <button
                            onClick={() => onApproveOrder(ord.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
                          >
                            Approve & Activate
                          </button>
                          <button
                            onClick={() => onRejectOrder(ord.id)}
                            className="px-2 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white font-medium text-xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Packages Config */}
      {activeTab === 'packages' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Subscription Tiers & Quota Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-sm">
                  <span>{pkg.name}</span>
                  <span className="text-indigo-400">${pkg.price}</span>
                </div>
                <div className="text-slate-400 text-[11px]">{pkg.description}</div>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div>Links: <span className="font-bold text-slate-200">{pkg.maxLinksQuota === -1 ? 'Unlimited' : pkg.maxLinksQuota}</span></div>
                  <div>Domains: <span className="font-bold text-slate-200">{pkg.hasAllDomainsAccess ? 'Unlimited' : pkg.maxCustomDomainsQuota}</span></div>
                  <div>Custom Alias: <span className="font-bold text-slate-200">{pkg.allowCustomAlias ? 'Yes' : 'No'}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Global Application & Domain Policy Settings</h2>
          </div>

          {settingsSaved && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              System configuration updated successfully.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl text-xs">
            <div>
              <label className="block font-medium mb-1 text-slate-400">Application Name</label>
              <input
                type="text"
                value={currentSettings.siteName}
                onChange={(e) => setCurrentSettings({...currentSettings, siteName: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-slate-400">Default Primary Short Domain</label>
              <input
                type="text"
                value={currentSettings.defaultDomain}
                onChange={(e) => setCurrentSettings({...currentSettings, defaultDomain: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-slate-400">Default Global Domain Availability Policy</label>
              <select
                value={currentSettings.defaultGlobalDomainPolicy}
                onChange={(e) => setCurrentSettings({...currentSettings, defaultGlobalDomainPolicy: e.target.value as any})}
                className="w-full px-3 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white text-sm"
              >
                <option value="paid_only">Available to all active paid subscribers (Starter/Pro/Business)</option>
                <option value="explicit_only">Only available via explicit administrator grant</option>
                <option value="all">Available to all registered users (including Free tier)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* Tab 6: Audit Logs */}
      {activeTab === 'logs' && (
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">Administrator Security & Authorization Audit Trail</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <th className="pb-3">Admin</th>
                  <th className="pb-3">Action Description</th>
                  <th className="pb-3">IP Address</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 text-xs">
                    <td className="py-3 font-semibold text-slate-200">{log.userName}</td>
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

      {/* Domain Permission Matrix Drawer / Modal */}
      {selectedUserForPerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-xl p-6 rounded-2xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold">
                  Domain Permissions: {selectedUserForPerms.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedUserForPerms.email}</p>
              </div>
              <button 
                onClick={() => setSelectedUserForPerms(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {domains.map((dom) => {
                const existingPerm = permissions.find(p => p.userId === selectedUserForPerms.id && p.domainId === dom.id);
                return (
                  <div key={dom.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center space-x-2">
                        <span>{dom.domainName}</span>
                        {dom.isGlobal && <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">Global</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Status: {existingPerm ? (existingPerm.isAllowed ? 'Explicitly Allowed' : 'Explicitly Denied') : 'Inherits Default'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onSetUserDomainPermission(selectedUserForPerms.id, dom.id, true)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          existingPerm?.isAllowed === true
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-emerald-600/20 hover:text-emerald-400'
                        }`}
                      >
                        Allow
                      </button>
                      <button
                        onClick={() => onSetUserDomainPermission(selectedUserForPerms.id, dom.id, false)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          existingPerm?.isAllowed === false
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-rose-600/20 hover:text-rose-400'
                        }`}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUserForPerms(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              >
                Close & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
