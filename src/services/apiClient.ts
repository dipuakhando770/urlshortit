/**
 * LinkPro Enterprise - Cloudflare Frontend to VPS Backend API Client
 * Authoritative connection to PHP 8.2 / Nginx / MariaDB backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface BackendConfig {
  baseUrl: string;
  apiToken: string;
  useProxy: boolean;
  proxyEndpoint: string;
  timeoutMs: number;
}

const DEFAULT_CONFIG: BackendConfig = {
  baseUrl: 'https://api.lnk.pro',
  apiToken: '',
  useProxy: false,
  proxyEndpoint: '/api',
  timeoutMs: 8000,
};

class ApiClient {
  private config: BackendConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  public loadConfig(): BackendConfig {
    const saved = localStorage.getItem('linkpro_backend_config');
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch {
        // Fallback to default
      }
    }
    // Check for environment variable if set
    const envUrl = (import.meta as any).env?.VITE_BACKEND_API_URL;
    return {
      ...DEFAULT_CONFIG,
      baseUrl: envUrl || DEFAULT_CONFIG.baseUrl,
    };
  }

  public saveConfig(newConfig: Partial<BackendConfig>): BackendConfig {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('linkpro_backend_config', JSON.stringify(this.config));
    return this.config;
  }

  public getConfig(): BackendConfig {
    return { ...this.config };
  }

  private getEffectiveUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (this.config.useProxy) {
      return `${this.config.proxyEndpoint}${cleanEndpoint}`;
    }
    return `${this.config.baseUrl.replace(/\/+$/, '')}${cleanEndpoint}`;
  }

  /**
   * Core request executor with timeout, error handling, and header injection
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
      'X-Requested-With': 'LinkPro-Cloudflare-Client',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.config.apiToken) {
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
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        return {
          success: false,
          error: {
            code: 'NON_JSON_RESPONSE',
            message: `Backend returned unexpected content (${response.status}): ${text.substring(0, 120)}`,
          },
        };
      }

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: json.error?.code || `HTTP_${response.status}`,
            message: json.error?.message || json.error || 'Server error occurred.',
          },
        };
      }

      // Handle standard response wrapping
      if (json.success !== undefined) {
        return json;
      }

      return {
        success: true,
        data: json,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'REQUEST_TIMEOUT',
            message: `Connection to backend (${url}) timed out after ${this.config.timeoutMs}ms.`,
          },
        };
      }
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message || 'Failed to connect to VPS backend. Check CORS and network connectivity.',
        },
      };
    }
  }

  /**
   * Ping / Health check to test connectivity and CORS
   */
  public async ping(): Promise<{
    reachable: boolean;
    latencyMs: number;
    url: string;
    details?: any;
    error?: string;
  }> {
    const startTime = performance.now();
    try {
      const res = await this.request('/api/health', { method: 'GET' });
      const latencyMs = Math.round(performance.now() - startTime);

      if (res.success) {
        return {
          reachable: true,
          latencyMs,
          url: this.getEffectiveUrl('/api/health'),
          details: res.data,
        };
      }

      return {
        reachable: false,
        latencyMs,
        url: this.getEffectiveUrl('/api/health'),
        error: res.error?.message || 'Unhealthy status',
      };
    } catch (e: any) {
      return {
        reachable: false,
        latencyMs: Math.round(performance.now() - startTime),
        url: this.getEffectiveUrl('/api/health'),
        error: e.message,
      };
    }
  }

  /**
   * Submit link shortening request to authoritative backend
   */
  public async createShortLink(payload: {
    domain_id: string;
    original_url: string;
    custom_alias?: string;
    title?: string;
    description?: string;
  }): Promise<ApiResponse<{
    id: string;
    short_code: string;
    short_url: string;
    domain_name: string;
    original_url: string;
  }>> {
    return this.request('/api/links', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Fetch permitted domains from backend
   */
  public async getDomains(): Promise<ApiResponse<any[]>> {
    return this.request('/api/domains', { method: 'GET' });
  }

  /**
   * Fetch user links from backend
   */
  public async getLinks(): Promise<ApiResponse<any[]>> {
    return this.request('/api/links', { method: 'GET' });
  }

  /**
   * Fetch user dashboard stats from backend
   */
  public async getStats(): Promise<ApiResponse<any>> {
    return this.request('/api/stats', { method: 'GET' });
  }
}

export const apiClient = new ApiClient();
