/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  initialLinks, 
  initialClickEvents, 
  initialUsers, 
  initialSettings, 
  initialAuditLogs,
  initialDomains,
  initialPackages,
  initialSubscriptions,
  initialOrders,
  initialUserPermissions
} from './data/initialData';
import { 
  LinkItem, 
  ClickEvent, 
  UserProfile, 
  AppSettings, 
  AuditLog, 
  CustomDomain, 
  PackageTier, 
  Subscription, 
  OrderRecord, 
  UserDomainPermission 
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DomainsView } from './components/DomainsView';
import { LinksView } from './components/LinksView';
import { PackagesBillingView } from './components/PackagesBillingView';
import { AnalyticsView } from './components/AnalyticsView';
import { InstallWizardView } from './components/InstallWizardView';
import { AdminView } from './components/AdminView';
import { SourceCodeView } from './components/SourceCodeView';
import { RedirectSandboxView } from './components/RedirectSandboxView';
import { CloudflareIntegrationView } from './components/CloudflareIntegrationView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { apiClient } from './services/apiClient';
import { vpsShortenerService } from './services/vpsShortenerService';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUsers[0]);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [domains, setDomains] = useState<CustomDomain[]>(initialDomains);
  const [packages, setPackages] = useState<PackageTier[]>(initialPackages);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [permissions, setPermissions] = useState<UserDomainPermission[]>(initialUserPermissions);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>(initialClickEvents);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Backend Health & Readiness State
  const [backendHealth, setBackendHealth] = useState<{
    status: 'checking' | 'ready' | 'online_only' | 'unreachable' | 'error';
    latencyMs: number;
    details?: any;
    error?: string;
  }>({
    status: 'checking',
    latencyMs: 0,
  });

  const currentPackage = packages.find(p => p.id === currentUser.packageId) || packages[0];
  const userSubscription = subscriptions.find(s => s.userId === currentUser.id);

  // Check backend health on mount
  const checkBackendHealth = async () => {
    setBackendHealth(prev => ({ ...prev, status: 'checking' }));
    const res = await apiClient.ping();
    if (res.reachable) {
      setBackendHealth({
        status: 'ready',
        latencyMs: res.latencyMs,
        details: res.health || res.ready,
      });
    } else {
      setBackendHealth({
        status: 'unreachable',
        latencyMs: res.latencyMs,
        error: res.error || 'Backend unreachable',
      });
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  /**
   * Sequential Shortening Flow with Plan & Quota Enforcement:
   * 1. Check user account active status.
   * 2. Check plan link quota.
   * 3. Validate original URL.
   * 4. Dispatch to Boss VPS API: POST /api/links/stage1
   * 5. Save and return real Boss VPS short URL.
   */
  const handleAddLink = async (
    domainId: string, 
    originalUrl: string, 
    customAlias?: string, 
    title?: string, 
    description?: string
  ): Promise<{ 
    success: boolean; 
    error?: string; 
    finalUrl?: string; 
    stage1Url?: string;
    stage1Code?: string;
    originalUrl?: string;
    stage1Id?: number;
  }> => {
    // 1. Account Status Check
    if (currentUser.status !== 'active') {
      return { success: false, error: 'Your account is suspended or disabled. Link creation is blocked.' };
    }

    // 2. Plan Quota Check
    const userLinks = links.filter(l => l.userId === currentUser.id);
    if (currentPackage.maxLinksQuota !== -1 && userLinks.length >= currentPackage.maxLinksQuota) {
      return { 
        success: false, 
        error: language === 'bn' 
          ? `আপনার প্ল্যান কোটা পূর্ণ হয়েছে (${currentPackage.name} প্ল্যানে সর্বোচ্চ ${currentPackage.maxLinksQuota} টি লিংক তৈরি করা যায়)। দয়া করে প্ল্যান আপগ্রেড করুন।`
          : `Plan quota reached! Your current plan (${currentPackage.name}) allows a maximum of ${currentPackage.maxLinksQuota} links. Please upgrade your plan.`
      };
    }

    // 3. Input Validation: Only HTTP and HTTPS permitted
    try {
      const parsed = new URL(originalUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { success: false, error: 'Original destination URL must be a valid HTTP or HTTPS address.' };
      }
    } catch {
      return { success: false, error: 'Malformed URL. Please enter a valid URL beginning with http:// or https://' };
    }

    const shortCode = customAlias && customAlias.trim() 
      ? customAlias.trim().replace(/[^a-zA-Z0-9_-]/g, '')
      : 's1_' + Math.random().toString(36).substring(2, 8);

    const domain = domains.find(d => d.id === domainId) || domains[0];
    const frontendStage1Url = `https://${domain.domainName}/${shortCode}`;

    // 4. Dispatch to Boss VPS API: POST /api/links/stage1
    const vpsRes = await vpsShortenerService.callVpsShorten(frontendStage1Url, originalUrl);

    if (!vpsRes.success || !vpsRes.finalShortUrl) {
      return {
        success: false,
        error: vpsRes.error?.message || 'Boss URL Shortener VPS API failed to generate short link.',
      };
    }

    const finalShortUrl = vpsRes.finalShortUrl;
    const finalCode = vpsRes.code || shortCode;
    const linkId = vpsRes.id ? Number(vpsRes.id) : Date.now();

    const newLink: LinkItem = {
      id: String(linkId),
      domainId: domain.id,
      domainName: domain.domainName,
      originalUrl,
      shortCode: finalCode,
      shortUrl: finalShortUrl,
      stage1ShortUrl: frontendStage1Url,
      title: title || originalUrl.replace(/^https?:\/\//, '').split('/')[0],
      description: description || 'Created via Boss VPS Sequential Shortener',
      clicks: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'active',
      userId: currentUser.id,
      redirectType: '302',
      stage1Id: typeof linkId === 'number' ? linkId : undefined,
      backendMode: 'stage1',
    };

    setLinks([newLink, ...links]);
    setDomains(domains.map(d => d.id === domain.id ? { ...d, totalLinksCount: d.totalLinksCount + 1 } : d));

    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `Boss VPS API Stage 1 Shortener: ${finalShortUrl} -> ${originalUrl}`,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs([newLog, ...auditLogs]);

    return { 
      success: true, 
      finalUrl: finalShortUrl, 
      stage1Url: finalShortUrl,
      stage1Code: finalCode,
      originalUrl,
      stage1Id: typeof linkId === 'number' ? linkId : undefined,
    };
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleAddDomain = (domainName: string, isGlobal: boolean) => {
    const token = 'lp_verify_' + Math.random().toString(36).substring(2, 10);
    const newDomain: CustomDomain = {
      id: 'dom_' + Date.now(),
      domainName,
      status: 'pending_verification',
      isVerified: false,
      verificationToken: token,
      dnsRecordType: 'dns_txt',
      expectedDnsHost: `_linkpro-verify.${domainName}`,
      expectedDnsValue: `linkpro-verify=${token}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      isGlobal,
      sslActive: false,
      totalLinksCount: 0,
      totalClicksCount: 0
    };

    setDomains([...domains, newDomain]);

    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `Added new custom domain ${domainName} with pending DNS TXT challenge`,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleVerifyDomain = (domainId: string) => {
    setDomains(domains.map(d => d.id === domainId ? {
      ...d,
      isVerified: true,
      status: 'active',
      sslActive: true,
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    } : d));

    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `DNS verified and SSL activated for custom domain ID ${domainId}`,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleDeleteDomain = (domainId: string) => {
    setDomains(domains.filter(d => d.id !== domainId));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        settings={settings}
        onUpdateSettings={setSettings}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        onLogout={() => {
          setCurrentUser(initialUsers[1]); // switch to regular user on logout
          setIsAuthModalOpen(true);
        }}
        backendUrl={apiClient.getConfig().baseUrl}
        onOpenCloudflareTab={() => setActiveTab('cloudflare')}
        backendHealth={backendHealth}
        onRefreshHealth={checkBackendHealth}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'admin' && currentUser.role !== 'admin') {
              alert(language === 'bn' ? 'অ্যাক্সেস ডিনাইড: এই অপশনটি শুধুমাত্র অ্যাডামিনের জন্য সংরক্ষিত।' : 'Access Denied: Admin console is restricted to admin credentials.');
              return;
            }
            setActiveTab(tab);
          }}
          darkMode={darkMode}
          language={language}
          totalLinks={links.length}
          totalDomains={domains.filter(d => d.isVerified).length}
          totalClicks={links.reduce((sum, l) => sum + l.clicks, 0)}
          pendingOrdersCount={orders.filter(o => o.status === 'pending_review').length}
          currentUser={currentUser}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              links={links}
              domains={domains}
              currentUser={currentUser}
              packages={packages}
              permissions={permissions}
              clickEvents={clickEvents}
              settings={settings}
              darkMode={darkMode}
              language={language}
              backendHealth={backendHealth}
              onAddLink={handleAddLink}
              onNavigateLinks={() => setActiveTab('links')}
              onNavigateDomains={() => setActiveTab('domains')}
              onNavigateBilling={() => setActiveTab('billing')}
              onNavigateCloudflare={() => setActiveTab('cloudflare')}
            />
          )}

          {activeTab === 'domains' && (
            <DomainsView
              domains={domains}
              currentUser={currentUser}
              permissions={permissions}
              packages={packages}
              darkMode={darkMode}
              language={language}
              onAddDomain={handleAddDomain}
              onVerifyDomain={handleVerifyDomain}
              onDeleteDomain={handleDeleteDomain}
            />
          )}

          {activeTab === 'links' && (
            <LinksView
              links={links}
              domains={domains}
              currentUser={currentUser}
              permissions={permissions}
              packages={packages}
              settings={settings}
              darkMode={darkMode}
              language={language}
              onAddLink={handleAddLink}
              onDeleteLink={handleDeleteLink}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              links={links}
              clickEvents={clickEvents}
              settings={settings}
              darkMode={darkMode}
              language={language}
            />
          )}

          {activeTab === 'billing' && (
            <PackagesBillingView
              packages={packages}
              currentUser={currentUser}
              subscription={userSubscription}
              orders={orders}
              darkMode={darkMode}
              language={language}
              onPurchasePackage={(pkg, method, trxRef, notes) => {
                const newOrder: OrderRecord = {
                  id: 'ord_' + Date.now(),
                  orderNumber: 'LP-2026-' + Math.floor(100000 + Math.random() * 900000),
                  userId: currentUser.id,
                  userName: currentUser.name,
                  packageId: pkg.id,
                  packageName: pkg.name,
                  amount: pkg.price,
                  currency: 'USD',
                  paymentMethod: method,
                  transactionReference: trxRef,
                  status: 'pending_review',
                  receiptNotes: notes,
                  createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
                };
                setOrders([newOrder, ...orders]);
              }}
            />
          )}

          {activeTab === 'admin' && currentUser.role === 'admin' && (
            <AdminView
              users={users}
              domains={domains}
              packages={packages}
              orders={orders}
              permissions={permissions}
              settings={settings}
              auditLogs={auditLogs}
              darkMode={darkMode}
              language={language}
              onUpdateSettings={setSettings}
              onUpdateUserStatus={(userId, newStatus) => {
                setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
              }}
              onToggleUserAllDomains={(userId) => {
                setUsers(users.map(u => u.id === userId ? { ...u, hasAllDomainsAccess: !u.hasAllDomainsAccess } : u));
              }}
              onSetUserDomainPermission={(userId, domainId, isAllowed) => {
                const existing = permissions.find(p => p.userId === userId && p.domainId === domainId);
                if (existing) {
                  setPermissions(permissions.map(p => p.userId === userId && p.domainId === domainId ? { ...p, isAllowed } : p));
                } else {
                  setPermissions([...permissions, {
                    id: 'perm_' + Date.now(),
                    userId,
                    domainId,
                    isAllowed,
                    grantedBy: currentUser.name,
                    grantedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
                  }]);
                }
              }}
              onVerifyDomain={handleVerifyDomain}
              onApproveOrder={(orderId) => {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'approved', reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) } : o));
              }}
              onRejectOrder={(orderId) => {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'rejected', reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) } : o));
              }}
            />
          )}

          {activeTab === 'installer' && (
            <InstallWizardView
              darkMode={darkMode}
              language={language}
            />
          )}

          {activeTab === 'codebase' && (
            <SourceCodeView
              darkMode={darkMode}
              language={language}
            />
          )}

          {activeTab === 'sandbox' && (
            <RedirectSandboxView
              links={links}
              domains={domains}
              darkMode={darkMode}
              language={language}
            />
          )}

          {activeTab === 'cloudflare' && (
            <CloudflareIntegrationView
              darkMode={darkMode}
              language={language}
            />
          )}
        </main>
      </div>

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        darkMode={darkMode}
        language={language}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <Footer settings={settings} darkMode={darkMode} language={language} />
    </div>
  );
}
