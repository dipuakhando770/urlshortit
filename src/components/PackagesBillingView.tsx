import React, { useState } from 'react';
import { PackageTier, UserProfile, Subscription, OrderRecord } from '../types';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Receipt, 
  ArrowRight, 
  AlertCircle,
  FileText,
  DollarSign,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface PackagesBillingViewProps {
  packages: PackageTier[];
  currentUser: UserProfile;
  subscription?: Subscription;
  orders: OrderRecord[];
  darkMode: boolean;
  language: 'bn' | 'en';
  onPurchasePackage: (pkg: PackageTier, paymentMethod: 'bkash_nagad' | 'bank_transfer' | 'stripe_card', trxRef: string, notes?: string) => void;
}

export const PackagesBillingView: React.FC<PackagesBillingViewProps> = ({
  packages,
  currentUser,
  subscription,
  orders,
  darkMode,
  language,
  onPurchasePackage
}) => {
  const [selectedPackage, setSelectedPackage] = useState<PackageTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bkash_nagad' | 'bank_transfer' | 'stripe_card'>('bkash_nagad');
  const [trxRef, setTrxRef] = useState('');
  const [receiptNotes, setReceiptNotes] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const activePackage = packages.find(p => p.id === currentUser.packageId) || packages[0];
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !trxRef.trim()) return;

    onPurchasePackage(selectedPackage, paymentMethod, trxRef, receiptNotes);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setSelectedPackage(null);
      setTrxRef('');
      setReceiptNotes('');
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <CreditCard className="w-4 h-4" />
          <span>{language === 'bn' ? 'সাবস্ক্রিপশন ও প্যাকেজ সিস্টেম' : 'Subscription & Pricing Plans'}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'bn' ? 'প্যাকেজসমূহ ও বিলিং হিস্ট্রি' : 'Subscription Plans & Billing Management'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === 'bn' 
            ? 'আপনার লিঙ্ক কোটা, কাস্টম ডোমেইন ক্যাপাসিটি এবং প্রিমিয়াম ফিচার আপগ্রেড করুন।' 
            : 'Upgrade your link quotas, verified custom domains, advanced analytics, and branded short links.'}
        </p>
      </div>

      {/* Active Subscription Overview Card */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden ${
        darkMode ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30' : 'bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 border-indigo-200 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-500">
                {language === 'bn' ? 'বর্তমান সক্রিয় প্ল্যান' : 'Current Active Plan'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                {activePackage.name} Tier
              </span>
              {currentUser.hasAllDomainsAccess && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Unlimited Domains VIP
                </span>
              )}
            </div>

            <div className="text-2xl font-bold">
              {activePackage.price === 0 ? 'Free Tier ($0/mo)' : `$${activePackage.price} / ${activePackage.billingPeriod}`}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subscription 
                ? `${language === 'bn' ? 'মেয়াদ শেষ হবে:' : 'Subscription Renews / Expires:'} ${subscription.expiresDate.split(' ')[0]}` 
                : 'No expiration date (Lifetime)'}
            </p>
          </div>

          {/* Quota Indicators */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-xs text-slate-400">{language === 'bn' ? 'লিংক তৈরির কোটা' : 'Links Quota'}</div>
              <div className="text-lg font-bold mt-0.5">
                {activePackage.maxLinksQuota === -1 ? 'Unlimited' : `${activePackage.maxLinksQuota} Links`}
              </div>
              <div className="text-[11px] text-emerald-500 font-medium mt-1">● Active & Monitored</div>
            </div>

            <div>
              <div className="text-xs text-slate-400">{language === 'bn' ? 'কাস্টম ডোমেইন সীমা' : 'Custom Domains'}</div>
              <div className="text-lg font-bold mt-0.5">
                {currentUser.hasAllDomainsAccess || activePackage.hasAllDomainsAccess 
                  ? 'Unlimited Verified' 
                  : `${activePackage.maxCustomDomainsQuota} Domains`}
              </div>
              <div className="text-[11px] text-indigo-400 font-medium mt-1">● DNS TXT Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Grid */}
      <div>
        <h2 className="text-lg font-bold mb-4">
          {language === 'bn' ? 'উপলব্ধ সাবস্ক্রিপশন প্যাকেজসমূহ' : 'Available Subscription Packages'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const isCurrent = pkg.id === currentUser.packageId;
            return (
              <div 
                key={pkg.id} 
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all relative ${
                  pkg.isPopular 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg' 
                    : darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="font-bold text-lg">{pkg.name}</div>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{pkg.description}</p>

                  <div className="my-5">
                    <span className="text-3xl font-extrabold tracking-tight">${pkg.price}</span>
                    <span className="text-xs text-slate-400 font-medium"> / {pkg.billingPeriod}</span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{pkg.maxLinksQuota === -1 ? 'Unlimited Links' : `${pkg.maxLinksQuota} Short Links`}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{pkg.hasAllDomainsAccess ? 'Unlimited Custom Domains' : `${pkg.maxCustomDomainsQuota} Custom Domains`}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Instant 302 Redirection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className={`w-4 h-4 ${pkg.allowCustomAlias ? 'text-emerald-400' : 'text-slate-600'} shrink-0`} />
                      <span className={pkg.allowCustomAlias ? '' : 'text-slate-500'}>Custom Short Code Aliases</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className={`w-4 h-4 ${pkg.hasAdvancedAnalytics ? 'text-emerald-400' : 'text-slate-600'} shrink-0`} />
                      <span className={pkg.hasAdvancedAnalytics ? '' : 'text-slate-500'}>Geo & Device Analytics</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPackage(pkg)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                      : pkg.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isCurrent ? (language === 'bn' ? 'বর্তমান প্যাকেজ' : 'Current Plan') : (language === 'bn' ? 'প্যাকেজ নির্বাচন করুন' : 'Upgrade Plan')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders / Invoices History */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold">
              {language === 'bn' ? 'অর্ডার ও পেমেন্ট হিস্ট্রি' : 'Order & Payment History'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">Total Orders: {userOrders.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold text-slate-400 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <th className="pb-3">Order #</th>
                <th className="pb-3">Package Tier</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Trx ID / Ref</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {userOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No payment history recorded yet.
                  </td>
                </tr>
              ) : (
                userOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                    <td className="py-3 font-mono font-semibold text-indigo-400">{ord.orderNumber}</td>
                    <td className="py-3 font-medium">{ord.packageName}</td>
                    <td className="py-3 font-bold">${ord.amount}</td>
                    <td className="py-3 capitalize">{ord.paymentMethod.replace('_', ' ')}</td>
                    <td className="py-3 font-mono text-slate-400">{ord.transactionReference}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        ord.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : ord.status === 'pending_review'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{ord.createdAt.split(' ')[0]}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment / Checkout Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">
                {language === 'bn' ? 'প্যাকেজ ক্রয় ও পেমেন্ট কনফার্মেশন' : 'Checkout & Payment Workflow'}
              </h3>
              <button 
                onClick={() => setSelectedPackage(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-emerald-400">Payment Request Submitted!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Your order has been placed into the Administrator Review Queue. Once verified, your package and custom domains will activate automatically.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-indigo-400">{selectedPackage.name} Package</div>
                    <div className="text-xs text-slate-400">{selectedPackage.maxLinksQuota === -1 ? 'Unlimited' : selectedPackage.maxLinksQuota} Links • {selectedPackage.hasAllDomainsAccess ? 'Unlimited Domains' : selectedPackage.maxCustomDomainsQuota} Domains</div>
                  </div>
                  <div className="text-xl font-extrabold text-indigo-400">
                    ${selectedPackage.price} <span className="text-xs font-normal text-slate-400">USD</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-slate-400">
                    Payment Gateway / Method
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash_nagad')}
                      className={`p-3 rounded-xl border text-left font-medium transition-all ${
                        paymentMethod === 'bkash_nagad' 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="font-bold">bKash / Nagad MFS</div>
                      <div className="text-[10px] text-slate-400">Merchant #01700-000000</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-xl border text-left font-medium transition-all ${
                        paymentMethod === 'bank_transfer' 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="font-bold">Bank Wire Transfer</div>
                      <div className="text-[10px] text-slate-400">Swift / Direct Deposit</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-400">
                    Transaction ID / Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BKASH-99210-AX or WIRE-9982"
                    value={trxRef}
                    onChange={(e) => setTrxRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-400">
                    Customer Notes / Agent Slip (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Sent from personal account or branch name..."
                    value={receiptNotes}
                    onChange={(e) => setReceiptNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-500/25 flex items-center space-x-1.5"
                  >
                    <span>Submit Payment Proof</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
