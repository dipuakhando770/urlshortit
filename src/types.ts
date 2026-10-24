export type AccountStatus = 'active' | 'pending' | 'suspended' | 'disabled';
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  avatar: string;
  packageId: string;
  subscriptionId?: string;
  hasAllDomainsAccess?: boolean;
  inheritFutureDomains?: boolean;
}

export type DomainStatus = 'pending_verification' | 'active' | 'inactive' | 'suspended';
export type DnsVerificationType = 'dns_txt' | 'cname' | 'http_file';

export interface CustomDomain {
  id: string;
  domainName: string;
  status: DomainStatus;
  isVerified: boolean;
  verificationToken: string;
  dnsRecordType: DnsVerificationType;
  expectedDnsHost: string;
  expectedDnsValue: string;
  verifiedAt?: string;
  createdAt: string;
  userId?: string; // owner or null if system/global
  isGlobal: boolean; // available to all paid users if true
  sslActive: boolean;
  totalLinksCount: number;
  totalClicksCount: number;
}

export interface UserDomainPermission {
  id: string;
  userId: string;
  domainId: string;
  isAllowed: boolean; // true = explicitly allowed, false = explicitly denied
  grantedBy: string;
  grantedAt: string;
}

export interface PackageTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly' | 'lifetime';
  maxLinksQuota: number; // -1 for unlimited
  maxCustomDomainsQuota: number; // -1 for unlimited
  hasAllDomainsAccess: boolean;
  allowCustomAlias: boolean;
  hasAdvancedAnalytics: boolean;
  hasApiAccess: boolean;
  status: 'active' | 'inactive';
  isPopular?: boolean;
}

export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled' | 'suspended';

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  status: SubscriptionStatus;
  startDate: string;
  expiresDate: string;
  autoRenew: boolean;
  paymentMethod: string;
}

export type OrderStatus = 'pending_review' | 'approved' | 'rejected';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  amount: number;
  currency: string;
  paymentMethod: 'bkash_nagad' | 'bank_transfer' | 'stripe_card';
  transactionReference: string;
  status: OrderStatus;
  receiptNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface LinkItem {
  id: string;
  domainId: string;
  domainName: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  title?: string;
  description?: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'disabled';
  password?: string;
  userId: string;
  lastClickedAt?: string;
  redirectType: '302' | '301';
}

export interface ClickEvent {
  id: string;
  linkId: string;
  domainId: string;
  domainName: string;
  shortCode: string;
  ipAddress: string;
  userAgent: string;
  referer: string;
  country: string;
  device: string;
  browser: string;
  clickedAt: string;
}

export interface AppSettings {
  siteName: string;
  defaultDomain: string;
  allowRegistration: boolean;
  defaultRedirectType: '302' | '301';
  maxUrlLength: number;
  rateLimitPerMin: number;
  maintenanceMode: boolean;
  defaultLanguage: 'bn' | 'en';
  requireDomainVerification: boolean;
  defaultGlobalDomainPolicy: 'paid_only' | 'explicit_only' | 'all';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  ip: string;
  timestamp: string;
}

export interface PHPFileEntry {
  path: string;
  name: string;
  category: 'public' | 'app' | 'services' | 'config' | 'database' | 'install' | 'docs' | 'nginx';
  content: string;
  description: string;
}
