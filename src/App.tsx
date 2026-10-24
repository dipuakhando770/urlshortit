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
  initialAuditLogs 
} from './data/initialData';
import { LinkItem, ClickEvent, UserProfile, AppSettings, AuditLog } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LinksView } from './components/LinksView';
import { AnalyticsView } from './components/AnalyticsView';
import { InstallWizardView } from './components/InstallWizardView';
import { AdminView } from './components/AdminView';
import { SourceCodeView } from './components/SourceCodeView';
import { RedirectSandboxView } from './components/RedirectSandboxView';
import { Footer } from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUsers[0]);
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>(initialClickEvents);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  const handleAddLink = (originalUrl: string, customAlias?: string, title?: string, description?: string) => {
    const shortCode = customAlias && customAlias.trim() 
      ? customAlias.trim().replace(/[^a-zA-Z0-9_-]/g, '')
      : Math.random().toString(36).substring(2, 8);

    const newLink: LinkItem = {
      id: 'lnk_' + Date.now(),
      originalUrl,
      shortCode,
      shortUrl: `${settings.baseUrl}/${shortCode}`,
      title: title || originalUrl.replace('https://', '').replace('http://', '').split('/')[0],
      description: description || '',
      clicks: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'active',
      userId: currentUser.id
    };

    setLinks([newLink, ...links]);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleLogout = () => {
    alert(language === 'bn' ? 'সফলভাবে লগআউট করা হয়েছে।' : 'Successfully logged out.');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        onLogout={handleLogout}
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
          totalClicks={links.reduce((sum, l) => sum + l.clicks, 0)}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              links={links}
              clickEvents={clickEvents}
              settings={settings}
              darkMode={darkMode}
              language={language}
              onAddLink={handleAddLink}
              onNavigateLinks={() => setActiveTab('links')}
            />
          )}

          {activeTab === 'links' && (
            <LinksView
              links={links}
              settings={settings}
              darkMode={darkMode}
              language={language}
              onAddLink={handleAddLink}
              onDeleteLink={handleDeleteLink}
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
              settings={settings}
              auditLogs={auditLogs}
              onUpdateSettings={handleUpdateSettings}
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
