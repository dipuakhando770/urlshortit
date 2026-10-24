export interface LinkItem {
  id: string;
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
}

export interface ClickEvent {
  id: string;
  linkId: string;
  shortCode: string;
  ipAddress: string;
  userAgent: string;
  referer: string;
  country: string;
  device: string;
  browser: string;
  clickedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  createdAt: string;
  avatar: string;
}

export interface AppSettings {
  siteName: string;
  baseUrl: string;
  allowRegistration: boolean;
  defaultRedirectType: '302' | '301';
  maxUrlLength: number;
  rateLimitPerMin: number;
  maintenanceMode: boolean;
  defaultLanguage: 'bn' | 'en';
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
  category: 'public' | 'app' | 'config' | 'database' | 'install' | 'docs' | 'nginx';
  content: string;
  description: string;
}
