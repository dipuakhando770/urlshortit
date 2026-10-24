import React, { useState } from 'react';
import { phpCodebaseFiles } from '../data/initialData';
import { 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  FolderGit2,
  FileText
} from 'lucide-react';

interface SourceCodeViewProps {
  darkMode: boolean;
  language: 'bn' | 'en';
}

export const SourceCodeView: React.FC<SourceCodeViewProps> = ({
  darkMode,
  language
}) => {
  const [selectedFile, setSelectedFile] = useState(phpCodebaseFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadRepositoryZip = () => {
    // Generate a downloadable representation of the repository
    const textContent = phpCodebaseFiles.map(f => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.content}\n\n`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkpro-php-v2.4-source.txt';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>{language === 'bn' ? 'গিটহাব রেপো এবং পিএইচপি সোর্স কোড' : 'GitHub Repository & PHP Backend Source'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'সম্পূর্ণ পিএইচপি ও এনজিন্ড কোডবেস' : 'Complete PHP, Nginx & MariaDB Codebase'}
          </h1>
        </div>
        <button
          onClick={downloadRepositoryZip}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-500/25 flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'bn' ? 'সোর্স কোড বান্ডেল ডাউনলোড করুন' : 'Download Complete Source Bundle'}</span>
        </button>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* File Tree Sidebar */}
        <div className={`p-4 rounded-2xl border lg:col-span-1 space-y-2 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {language === 'bn' ? 'প্রজেক্ট ফাইল স্ট্রাকচার' : 'Repository Files'}
          </div>
          <div className="space-y-1">
            {phpCodebaseFiles.map((file, idx) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-2.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Box */}
        <div className={`rounded-2xl border lg:col-span-3 overflow-hidden flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className={`p-4 border-b flex items-center justify-between ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className="font-mono text-sm font-bold text-indigo-500 dark:text-indigo-400">
                {selectedFile.path}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-6 bg-slate-950 text-slate-200 overflow-x-auto font-mono text-xs leading-relaxed flex-1">
            <pre className="text-indigo-300">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
