import React, { useState } from 'react';
import { LinkItem, AppSettings } from '../types';
import { 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  QrCode, 
  Filter, 
  Sparkles,
  Calendar,
  MousePointerClick
} from 'lucide-react';

interface LinksViewProps {
  links: LinkItem[];
  settings: AppSettings;
  darkMode: boolean;
  language: 'bn' | 'en';
  onAddLink: (originalUrl: string, customAlias?: string, title?: string, description?: string) => void;
  onDeleteLink: (id: string) => void;
}

export const LinksView: React.FC<LinksViewProps> = ({
  links,
  settings,
  darkMode,
  language,
  onAddLink,
  onDeleteLink
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalLink, setQrModalLink] = useState<LinkItem | null>(null);

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (link.title && link.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;
    onAddLink(originalUrl, customAlias, title, description);
    setOriginalUrl('');
    setCustomAlias('');
    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'আমার শর্ট লিংকসমূহ' : 'My Short Links'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'আপনার সমস্ত শর্ট লিংক এবং তাদের ক্লিক স্ট্যাটিস্টিকস পরিচালনা করুন।' : 'Manage all your short URLs and monitor performance metrics.'}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন লিংক তৈরি করুন' : 'Create New Link'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'লিংক বা শর্ট কোড দিয়ে খুঁজুন...' : 'Search by URL, title or short code...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
            }`}
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3.5 py-2 rounded-xl border text-sm outline-none transition-all ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
            <option value="active">{language === 'bn' ? 'সক্রিয় (Active)' : 'Active'}</option>
            <option value="expired">{language === 'bn' ? 'মেয়াদোত্তীর্ণ (Expired)' : 'Expired'}</option>
            <option value="disabled">{language === 'bn' ? 'নিষ্ক্রিয় (Disabled)' : 'Disabled'}</option>
          </select>
        </div>
      </div>

      {/* Links List Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <th className="p-4">{language === 'bn' ? 'শিরোনাম ও শর্ট ইউআরএল' : 'Title & Short URL'}</th>
                <th className="p-4">{language === 'bn' ? 'মূল ডেসটিনেশন' : 'Original URL'}</th>
                <th className="p-4">{language === 'bn' ? 'ক্লিক' : 'Clicks'}</th>
                <th className="p-4">{language === 'bn' ? 'তৈরির সময়' : 'Created At'}</th>
                <th className="p-4">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="p-4 text-right">{language === 'bn' ? 'অ্যাকশনসমূহ' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    {language === 'bn' ? 'কোনো লিংক পাওয়া যায়নি।' : 'No links found matching your criteria.'}
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-sm">{link.title || `Short /${link.shortCode}`}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <a 
                          href={`/${link.shortCode}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                        >
                          <span>lnk.pro/{link.shortCode}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-500 dark:text-slate-400 text-xs">
                      {link.originalUrl}
                    </td>
                    <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <MousePointerClick className="w-3.5 h-3.5 inline text-emerald-500" />
                      <span>{link.clicks}</span>
                    </td>
                    <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 inline text-slate-400" />
                        <span>{link.createdAt.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        link.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => setQrModalLink(link)}
                        className={`p-2 rounded-lg border transition-all inline-flex items-center ${
                          darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Show QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(`https://lnk.pro/${link.shortCode}`, link.id)}
                        className={`p-2 rounded-lg border transition-all inline-flex items-center ${
                          copiedId === link.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : darkMode 
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Copy Short URL"
                      >
                        {copiedId === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onDeleteLink(link.id)}
                        className={`p-2 rounded-lg border transition-all inline-flex items-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 ${
                          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                        }`}
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold">
                  {language === 'bn' ? 'নতুন শর্ট লিংক তৈরি করুন' : 'Create New Short Link'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-400">
                  {language === 'bn' ? 'মূল ইউআরএল (ডেসটিনেশন)' : 'Original URL *'}
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/long-url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-400">
                  {language === 'bn' ? 'কাস্টম শর্ট কোড বা অ্যালিয়াস (ঐচ্ছিক)' : 'Custom Alias (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. promo2026"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-400">
                  {language === 'bn' ? 'লিংকের শিরোনাম (ঐচ্ছিক)' : 'Link Title (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spring Sale Campaign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 text-slate-400">
                  {language === 'bn' ? 'বিবরণ বা নোট (ঐচ্ছিক)' : 'Description (Optional)'}
                </label>
                <textarea
                  placeholder="Add notes about this campaign..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-500/25"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-sm p-6 rounded-2xl border shadow-xl text-center ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold mb-1">
              {language === 'bn' ? 'কিউআর কোড স্ক্যানার' : 'QR Code for Short URL'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">lnk.pro/{qrModalLink.shortCode}</p>

            <div className="bg-white p-4 rounded-2xl inline-block border shadow-inner mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://lnk.pro/${qrModalLink.shortCode}`} 
                alt="QR Code" 
                className="w-40 h-40 mx-auto"
              />
            </div>

            <button
              onClick={() => setQrModalLink(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
