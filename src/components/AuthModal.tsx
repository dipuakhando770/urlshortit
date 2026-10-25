import React, { useState } from 'react';
import { UserProfile } from '../types';
import { apiClient } from '../services/apiClient';
import { Zap, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  darkMode: boolean;
  language: 'bn' | 'en';
  onSuccess: (user: UserProfile, token?: string) => void;
  onClose?: () => void;
  allowClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  darkMode,
  language,
  onSuccess,
  onClose,
  allowClose = true
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে ইমেল ও পাসওয়ার্ড দিন।' : 'Please enter email and password.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম দিন।' : 'Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        // Attempt live VPS API login
        const res = await apiClient.login(trimmedEmail, trimmedPassword);
        if (res.success && res.data) {
          const u = res.data.user;
          const userProfile: UserProfile = {
            id: String(u.id),
            name: u.full_name || u.email.split('@')[0],
            email: u.email,
            role: u.role_name === 'admin' ? 'admin' : 'user',
            status: u.status === 'active' ? 'active' : 'suspended',
            createdAt: u.created_at,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            packageId: res.data.subscription?.plan_name ? 'pkg_starter' : 'pkg_free',
          };
          setSuccessMsg(language === 'bn' ? 'সফলভাবে লগইন হয়েছে!' : 'Successfully signed in!');
          setTimeout(() => {
            onSuccess(userProfile, res.data?.token);
          }, 800);
        } else {
          setErrorMsg(res.error?.message || 'Invalid email or password.');
        }
      } else {
        // Attempt live VPS API registration
        const res = await apiClient.register(name.trim(), trimmedEmail, trimmedPassword);
        if (res.success && res.data) {
          const u = res.data.user;
          const userProfile: UserProfile = {
            id: String(u.id),
            name: name.trim(),
            email: u.email,
            role: 'user',
            status: 'active',
            createdAt: u.created_at,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            packageId: 'pkg_free',
          };
          setSuccessMsg(language === 'bn' ? 'একাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account registered successfully!');
          setTimeout(() => {
            onSuccess(userProfile, res.data?.token);
          }, 800);
        } else {
          setErrorMsg(res.error?.message || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-3">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'login' 
              ? (language === 'bn' ? 'বস ইউআরএল শর্টনার - লগইন' : 'Sign In to Boss Shortener')
              : (language === 'bn' ? 'নতুন একাউন্ট তৈরি করুন' : 'Create Boss Account')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' 
              ? 'উবুন্টু ভিপিএস ও ক্লাউডফ্লেয়ার চালিত হাই-পারফরম্যান্স শর্টনার ড্যাশবোর্ড'
              : 'Ubuntu VPS + Cloudflare Enterprise URL Management'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'সাইন ইন (Sign In)' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'সাইন আপ (Sign Up)' : 'Sign Up'}
          </button>
        </div>

        {/* Error / Success messages */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Nasir Mia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {language === 'bn' ? 'ইমেল ঠিকানা' : 'Email Address'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="nasirmia360.02@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 mt-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'login' ? (language === 'bn' ? 'সাইন ইন করুন' : 'Sign In Now') : (language === 'bn' ? 'একাউন্ট তৈরি করুন' : 'Create Account')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 mb-2">Want to explore instantly without signing up?</p>
          <button
            type="button"
            onClick={() => {
              onSuccess({
                id: 'usr_demo_1',
                name: 'Nasir Mia',
                email: 'nasirmia360.02@gmail.com',
                role: 'admin',
                status: 'active',
                createdAt: '2026-01-01 00:00:00',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                packageId: 'pkg_business'
              });
            }}
            className="text-xs font-medium text-indigo-400 hover:underline"
          >
            Bypass & Enter Demo Dashboard &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
