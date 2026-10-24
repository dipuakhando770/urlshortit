/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

  const currentPackage = packages.find(p => p.id === currentUser.packageId) || packages[0];
  const userSubscription = subscriptions.find(s => s.userId === currentUser.id);

  // Two-Stage Sequential URL Shortening Architecture
  // Stage 1: Existing Frontend Branded Shortener
  // Stage 2: Authoritative Ubuntu VPS shorten.php API
  const handleAddLink = async (
    domainId: string, 
    originalUrl: string, 
    customAlias?: string, 
    title?: string, 
    description?: string,
    existingStage1Url?: string
  ): Promise<{ 
    success: boolean; 
    error?: string; 
    finalUrl?: string; 
    stage1Url?: string;
    stage?: 'stage1' | 'stage2';
  }> => {
    // 1. Input Validation: Only HTTP and HTTPS permitted
    try {
      const parsed = new URL(originalUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { success: false, error: 'Original destination URL must be a valid HTTP or HTTPS address.', stage: 'stage1' };
      }
    } catch {
      return { success: false, error: 'Malformed URL. Please enter a valid URL beginning with http:// or https://', stage: 'stage1' };
    }

    // 2. Account & Subscription State Checks
    if (currentUser.status !== 'active') {
      return { success: false, error: 'Your account is suspended or disabled. Link creation is blocked.', stage: 'stage1' };
    }

    const domain = domains.find(d => d.id === domainId);
    if (!domain) {
      return { success: false, error: 'Target short-link domain does not exist.', stage: 'stage1' };
    }

    if (!domain.isVerified) {
      return { success: false, error: `Domain '${domain.domainName}' is pending DNS TXT verification. Unverified domains cannot be used.`, stage: 'stage1' };
    }

    if (domain.status !== 'active') {
      return { success: false, error: `Domain '${domain.domainName}' is currently inactive or suspended.`, stage: 'stage1' };
    }

    // Explicit User-Level Denial check
    const explicitPerm = permissions.find(p => p.userId === currentUser.id && p.domainId === domain.id);
    if (explicitPerm && !explicitPerm.isAllowed) {
      return { success: false, error: `Domain Access Denied: Administrator has explicitly denied your account access to '${domain.domainName}'.`, stage: 'stage1' };
    }

    // Permission authorization
    const hasExplicitAllow = explicitPerm && explicitPerm.isAllowed;
    const hasUnlimitedDomainAccess = currentUser.hasAllDomainsAccess || currentPackage.hasAllDomainsAccess;
    const isDomainOwner = domain.userId === currentUser.id;
    const isGlobalAndPaid = domain.isGlobal && currentUser.packageId !== 'pkg_free';

    if (!hasExplicitAllow && !hasUnlimitedDomainAccess && !isDomainOwner && !isGlobalAndPaid) {
      return { 
        success: false, 
        error: `Domain Access Denied: '${domain.domainName}' is not included in your current subscription plan (${currentPackage.name}). Please upgrade.`,
        stage: 'stage1'
      };
    }

    // Subscription Quota Check
    const userLinks = links.filter(l => l.userId === currentUser.id);
    if (currentPackage.maxLinksQuota !== -1 && userLinks.length >= currentPackage.maxLinksQuota) {
      return { 
        success: false, 
        error: `Subscription limit reached! Your plan (${currentPackage.name}) allows a maximum of ${currentPackage.maxLinksQuota} short links.`,
        stage: 'stage1'
      };
    }

    if (customAlias && customAlias.trim() && !currentPackage.allowCustomAlias && currentUser.role !== 'admin') {
      return { success: false, error: 'Custom short aliases require a paid subscription tier.', stage: 'stage1' };
    }

    // --- STAGE 1: EXISTING FRONTEND SHORTENER ---
    let stage1ShortUrl = existingStage1Url;
    let shortCode = '';

    if (!stage1ShortUrl) {
      shortCode = customAlias && customAlias.trim() 
        ? customAlias.trim().replace(/[^a-zA-Z0-9_-]/g, '')
        : Math.random().toString(36).substring(2, 8);

      const isDuplicate = links.some(l => l.domainId === domain.id && l.shortCode.toLowerCase() === shortCode.toLowerCase());
      if (isDuplicate) {
        return { success: false, error: `Short code '/${shortCode}' is already taken on domain '${domain.domainName}'. Please choose a different code.`, stage: 'stage1' };
      }

      stage1ShortUrl = `https://${domain.domainName}/${shortCode}`;
    }

    // --- STAGE 2: CALL UBUNTU VPS shorten.php ---
    // The VPS backend receives { short_url: stage1ShortUrl, original_url: originalUrl }
    const stage2Res = await vpsShortenerService.callVpsShorten(stage1ShortUrl, originalUrl);

    if (!stage2Res.success || !stage2Res.finalShortUrl) {
      // Stage 2 failed: Never display a fabricated final URL if Stage 2 fails!
      return {
        success: false,
        error: stage2Res.error?.message || 'VPS Backend /shorten.php failed to generate the final short URL.',
        stage: 'stage2',
        stage1Url: stage1ShortUrl
      };
    }

    const finalShortUrl = stage2Res.finalShortUrl;
    const finalCode = stage2Res.code || shortCode;

    // The final URL returned by the VPS backend is the ONLY URL presented as final result
    const newLink: LinkItem = {
      id: stage2Res.id || ('lnk_' + Date.now()),
      domainId: domain.id,
      domainName: domain.domainName,
      originalUrl, // Must remain original long URL
      shortCode: finalCode,
      shortUrl: finalShortUrl, // ONLY the backend-generated final URL is presented
      stage1ShortUrl, // Preserved for transparency
      title: title || originalUrl.replace(/^https?:\/\//, '').split('/')[0],
      description: description || '',
      clicks: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'active',
      userId: currentUser.id,
      redirectType: '302'
    };

    setLinks([newLink, ...links]);
    setDomains(domains.map(d => d.id === domain.id ? { ...d, totalLinksCount: d.totalLinksCount + 1 } : d));

    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `Sequential Shortener: [Stage 1: ${stage1ShortUrl}] -> [Stage 2 VPS Final: ${finalShortUrl}] -> ${originalUrl.substring(0, 30)}...`,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs([newLog, ...auditLogs]);

    return { 
      success: true, 
      finalUrl: finalShortUrl, 
      stage1Url: stage1ShortUrl 
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

    // Add Audit Log
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

    const dom = domains.find(d => d.id === domainId);
    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `Successfully verified DNS TXT challenge and activated domain ${dom?.domainName}`,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleDeleteDomain = (domainId: string) => {
    setDomains(domains.filter(d => d.id !== domainId));
  };

  const handlePurchasePackage = (pkg: PackageTier, paymentMethod: 'bkash_nagad' | 'bank_transfer' | 'stripe_card', trxRef: string, notes?: string) => {
    const newOrder: OrderRecord = {
      id: 'ord_' + Date.now(),
      orderNumber: `LP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      packageId: pkg.id,
      packageName: `${pkg.name} (${pkg.billingPeriod})`,
      amount: pkg.price,
      currency: pkg.currency,
      paymentMethod,
      transactionReference: trxRef,
      status: 'pending_review',
      receiptNotes: notes || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setOrders([newOrder, ...orders]);

    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `Submitted order ${newOrder.orderNumber} for ${pkg.name} via ${paymentMethod} (Ref: ${trxRef})`,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleApproveOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(orders.map(o => o.id === orderId ? {
      ...o,
      status: 'approved',
      reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    } : o));

    // Upgrade target user
    setUsers(users.map(u => u.id === order.userId ? {
      ...u,
      packageId: order.packageId
    } : u));

    if (currentUser.id === order.userId) {
      setCurrentUser({
        ...currentUser,
        packageId: order.packageId
      });
    }

    const newLog: AuditLog = {
      id: 'aud_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action: `Approved order ${order.orderNumber} and upgraded user ${order.userName} to ${order.packageName}`,
      ip: '192.168.1.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
  };

  const handleUpdateUserStatus = (userId: string, newStatus: 'active' | 'suspended') => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleToggleUserAllDomains = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? {
      ...u,
      hasAllDomainsAccess: !u.hasAllDomainsAccess
    } : u));
    if (currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        hasAllDomainsAccess: !currentUser.hasAllDomainsAccess
      });
    }
  };

  const handleSetUserDomainPermission = (userId: string, domainId: string, isAllowed: boolean) => {
    const existing = permissions.find(p => p.userId === userId && p.domainId === domainId);
    if (existing) {
      setPermissions(permissions.map(p => p.id === existing.id ? { ...p, isAllowed } : p));
    } else {
      const newPerm: UserDomainPermission = {
        id: 'prm_' + Date.now(),
        userId,
        domainId,
        isAllowed,
        grantedBy: currentUser.id,
        grantedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setPermissions([...permissions, newPerm]);
    }
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
        onLogout={() => alert(language === 'bn' ? 'সফলভাবে লগআউট করা হয়েছে।' : 'Successfully logged out.')}
        backendUrl={apiClient.getConfig().baseUrl}
        onOpenCloudflareTab={() => setActiveTab('cloudflare')}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          language={language}
          totalLinks={links.length}
          totalDomains={domains.filter(d => d.isVerified).length}
          totalClicks={links.reduce((sum, l) => sum + l.clicks, 0)}
          pendingOrdersCount={orders.filter(o => o.status === 'pending_review').length}
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
              onAddLink={handleAddLink}
              onNavigateLinks={() => setActiveTab('links')}
              onNavigateDomains={() => setActiveTab('domains')}
              onNavigateBilling={() => setActiveTab('billing')}
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

          {activeTab === 'billing' && (
            <PackagesBillingView
              packages={packages}
              currentUser={currentUser}
              subscription={userSubscription}
              orders={orders}
              darkMode={darkMode}
              language={language}
              onPurchasePackage={handlePurchasePackage}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              clickEvents={clickEvents}
              links={links}
              settings={settings}
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

          {activeTab === 'installer' && (
            <InstallWizardView
              language={language}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'admin' && (
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
              onUpdateUserStatus={handleUpdateUserStatus}
              onToggleUserAllDomains={handleToggleUserAllDomains}
              onSetUserDomainPermission={handleSetUserDomainPermission}
              onVerifyDomain={handleVerifyDomain}
              onApproveOrder={handleApproveOrder}
              onRejectOrder={handleRejectOrder}
            />
          )}

          {activeTab === 'cloudflare' && (
            <CloudflareIntegrationView
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
        </main>
      </div>

      {/* Footer */}
      <Footer
        settings={settings}
        darkMode={darkMode}
        language={language}
      />
    </div>
  );
}
