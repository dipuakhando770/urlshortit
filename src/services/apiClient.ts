/**
 * Boss URL Shortener - Centralized Production API Client
 * Authoritative connection to Ubuntu VPS + Nginx + PHP-FPM 7.4 + MariaDB backend
 * Base URL: http://107.174.37.180
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface BackendConfig {
  baseUrl: string;
  apiToken: string;
  useProxy: boolean;
  proxyEndpoint: string;
  timeoutMs: number;
}

export interface HealthResponse {
  status: string;
  timestamp: number;
  app: string;
  env: string;
}

export interface ReadyResponse {
  ready: boolean;
  status: string;
  checks: {
    database: boolean;
    storage: boolean;
  };
  php_version: string;
  timestamp: number;
}

export interface Stage1LinkResponse {
  error: boolean;
  message: string;
  success: boolean;
  mode: string;
  stage1_id: number;
  stage1_code: string;
  stage1_url: string;
  original_url: string;
}

export interface AuthenticatedLinkResponse {
  error: boolean;
  id: number;
  code: string;
  shorturl: string;
  short_url: string;
  original_url: string;
  message: string;
}

export interface BackendLinkItem {
  id: number;
  user_id: number;
  code: string;
  original_url: string;
  stage1_url: string | null;
  destination_url: string;
  link_type: string;
  title: string;
  status: 'active' | 'expired' | 'disabled';
  is_custom_alias: number;
  expires_at: string | null;
  click_count: number;
  created_at: string;
  updated_at: string;
  short_url: string;
}

export interface AuthUser {
  id: number;
  role_id: number;
  role_name: string;
  email: string;
  full_name: string | null;
  api_key: string;
  status: string;
  created_at: string;
}

export interface AuthResponse {
  error: boolean;
  message: string;
  user: AuthUser;
  token?: string;
  csrf_token?: string;
  expires_at?: number;
  subscription?: {
    subscription_id: number;
    subscription_status: string;
    plan_name: string;
    max_links: number;
  };
}

// Read API base URL from environment variable or default to production VPS
const getEnvBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL || 
                 (import.meta as any).env?.VITE_BACKEND_API_BASE_URL || 
                 (import.meta as any).env?.VITE_BACKEND_API_URL;
  return envUrl ? envUrl.replace(/\/+$/, '') : 'http://107.174.37.180';
};

// Auto-detect if browser is running under HTTPS (e.g. AI Studio preview)
// If page is HTTPS and target is HTTP, proxying through /api prevents Mixed Content blocks
const shouldUseProxyByDefault = (): boolean => {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    const envUrl = getEnvBaseUrl();
    return envUrl.startsWith('http://');
  }
  return false;
};

const DEFAULT_CONFIG: BackendConfig = {
  baseUrl: getEnvBaseUrl(),
  apiToken: '',
  useProxy: shouldUseProxyByDefault(),
  proxyEndpoint: '/api',
  timeoutMs: 10000,
};

class ApiClient {
  private config: BackendConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  public loadConfig(): BackendConfig {
    const defaultUrl = getEnvBaseUrl();
    const saved = localStorage.getItem('boss_backend_config') || localStorage.getItem('linkpro_backend_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          // Ensure baseUrl is not empty
          baseUrl: parsed.baseUrl || defaultUrl,
        };
      } catch {
        // Fallback to default
      }
    }
    return {
      ...DEFAULT_CONFIG,
      baseUrl: defaultUrl,
    };
  }

  public saveConfig(newConfig: Partial<BackendConfig>): BackendConfig {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('boss_backend_config', JSON.stringify(this.config));
    return this.config;
  }

  public getConfig(): BackendConfig {
    return { ...this.config };
  }

  public getBaseUrl(): string {
    return this.config.baseUrl.replace(/\/+$/, '');
  }

  public setApiToken(token: string): void {
    this.saveConfig({ apiToken: token });
  }

  public getEffectiveUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (this.config.useProxy) {
      // In proxy mode, rewrite `/api/...` to the proxyEndpoint
      if (cleanEndpoint.startsWith('/api/')) {
        return `${this.config.proxyEndpoint}${cleanEndpoint.substring(4)}`;
      }
      return `${this.config.proxyEndpoint}${cleanEndpoint}`;
    }
    return `${this.getBaseUrl()}${cleanEndpoint}`;
  }

  /**
   * Centralized HTTP Request Executor
   * Handles timeouts, JSON parsing, status codes, and error formatting
   */
  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = this.getEffectiveUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'Boss-Shortener-Frontend',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.config.apiToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.config.apiToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      let responseData: any;

      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          responseData = JSON.parse(text);
        } catch {
          return {
            success: false,
            error: {
              code: 'NON_JSON_RESPONSE',
              message: `Server returned non-JSON response (${response.status}): ${text.substring(0, 150)}`,
            },
          };
        }
      }

      // Handle HTTP error status codes
      if (!response.ok) {
        let errorCode = `HTTP_${response.status}`;
        let errorMessage = 'An unexpected server error occurred.';

        if (response.status === 400) {
          errorCode = 'BAD_REQUEST';
          errorMessage = responseData.message || 'Invalid request parameters.';
        } else if (response.status === 401) {
          errorCode = 'UNAUTHORIZED';
          errorMessage = responseData.message || 'Authentication required. Please sign in or check API token.';
        } else if (response.status === 403) {
          errorCode = 'FORBIDDEN';
          errorMessage = responseData.message || 'You do not have permission to access or modify this resource.';
        } else if (response.status === 404) {
          errorCode = 'NOT_FOUND';
          errorMessage = responseData.message || 'The requested resource or endpoint was not found.';
        } else if (response.status === 422) {
          errorCode = 'VALIDATION_ERROR';
          errorMessage = responseData.message || 'Validation failed for submitted URL or input data.';
        } else if (response.status === 429) {
          errorCode = 'RATE_LIMITED';
          errorMessage = responseData.message || 'Rate limit exceeded. Please wait a moment before trying again.';
        } else if (response.status >= 500) {
          errorCode = 'SERVER_ERROR';
          errorMessage = responseData.message || `Internal Server Error (${response.status}) on backend VPS.`;
        }

        return {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            details: responseData,
          },
        };
      }

      // Check if backend returned an error field inside JSON (e.g. error: true)
      if (responseData && responseData.error === true) {
        return {
          success: false,
          error: {
            code: 'API_ERROR',
            message: responseData.message || 'Backend rejected the request.',
            details: responseData,
          },
        };
      }

      return {
        success: true,
        data: responseData,
      };

    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'REQUEST_TIMEOUT',
            message: `Request to backend (${url}) timed out after ${this.config.timeoutMs}ms.`,
          },
        };
      }

      // If mixed content or network failure
      const isMixedContent = typeof window !== 'undefined' && 
                             window.location.protocol === 'https:' && 
                             url.startsWith('http://');

      let message = err.message || 'Network error occurred while contacting backend.';
      if (isMixedContent) {
        message = `Browser blocked request to ${url} due to HTTPS Mixed Content restrictions. Switch to Proxy mode in settings.`;
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message,
        },
      };
    }
  }

  // --- HEALTH & READINESS ENDPOINTS ---

  public async getHealth(): Promise<ApiResponse<HealthResponse>> {
    return this.request<HealthResponse>('/api/health', { method: 'GET' });
  }

  public async getReady(): Promise<ApiResponse<ReadyResponse>> {
    return this.request<ReadyResponse>('/api/ready', { method: 'GET' });
  }

  public async ping(): Promise<{
    reachable: boolean;
    latencyMs: number;
    url: string;
    health?: HealthResponse;
    ready?: ReadyResponse;
    error?: string;
  }> {
    const startTime = performance.now();
    try {
      const [healthRes, readyRes] = await Promise.all([
        this.getHealth(),
        this.getReady(),
      ]);

      const latencyMs = Math.round(performance.now() - startTime);

      if (healthRes.success && readyRes.success) {
        return {
          reachable: true,
          latencyMs,
          url: this.getEffectiveUrl('/api/health'),
          health: healthRes.data,
          ready: readyRes.data,
        };
      }

      const errorMsg = healthRes.error?.message || readyRes.error?.message || 'Server check failed';
      return {
        reachable: false,
        latencyMs,
        url: this.getEffectiveUrl('/api/health'),
        error: errorMsg,
      };
    } catch (e: any) {
      return {
        reachable: false,
        latencyMs: Math.round(performance.now() - startTime),
        url: this.getEffectiveUrl('/api/health'),
        error: e.message || 'Connection failed',
      };
    }
  }

  // --- STAGE 1 LINK CREATION (POST /api/links/stage1) ---

  public async createStage1Link(url: string): Promise<ApiResponse<Stage1LinkResponse>> {
    // Client-side URL validation before dispatching
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return {
          success: false,
          error: {
            code: 'INVALID_PROTOCOL',
            message: 'Only HTTP and HTTPS URLs are allowed.',
          },
        };
      }
    } catch {
      return {
        success: false,
        error: {
          code: 'MALFORMED_URL',
          message: 'Please provide a valid web URL starting with http:// or https://',
        },
      };
    }

    return this.request<Stage1LinkResponse>('/api/links/stage1', {
      method: 'POST',
      body: JSON.stringify({ url: url.trim() }),
    });
  }

  // --- AUTHENTICATED LINK CREATION (POST /api/links) ---

  public async createAuthenticatedLink(url: string): Promise<ApiResponse<AuthenticatedLinkResponse>> {
    return this.request<AuthenticatedLinkResponse>('/api/links', {
      method: 'POST',
      body: JSON.stringify({ url: url.trim() }),
    });
  }

  // --- LINK LIST & MANAGEMENT (GET /api/links, DELETE /api/links/:id) ---

  public async getLinks(page = 1, perPage = 20): Promise<ApiResponse<{
    links: BackendLinkItem[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  }>> {
    return this.request(`/api/links?page=${page}&per_page=${perPage}`, {
      method: 'GET',
    });
  }

  public async getLink(id: number | string): Promise<ApiResponse<{ link: BackendLinkItem }>> {
    return this.request(`/api/links/${id}`, {
      method: 'GET',
    });
  }

  public async deleteLink(id: number | string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/api/links/${id}`, {
      method: 'DELETE',
    });
  }

  // --- AUTHENTICATION (POST /api/auth/login, POST /api/auth/register, GET /api/auth/me) ---

  public async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const res = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data?.token) {
      this.setApiToken(res.data.token);
    }
    return res;
  }

  public async register(name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const res = await this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res.success && res.data?.token) {
      this.setApiToken(res.data.token);
    }
    return res;
  }

  public async getMe(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/me', {
      method: 'GET',
    });
  }

  public logout(): void {
    this.setApiToken('');
  }
}

export const apiClient = new ApiClient();
