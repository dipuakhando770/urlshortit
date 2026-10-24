/**
 * Dedicated Integration Service for Ubuntu VPS Final Shortener API
 * Endpoint: /shorten.php
 *
 * Implements Stage 2 of the two-stage sequential shortening workflow:
 * Stage 1: Existing LinkPro frontend generates branded Stage 1 short URL.
 * Stage 2: This service dispatches { short_url: stage1_url, original_url: long_url }
 *          to the Ubuntu VPS /shorten.php endpoint and retrieves the authoritative final URL.
 */

import { VpsShortenRequest, VpsShortenResponse } from '../types';
import { apiClient } from './apiClient';

export interface VpsFinalShortenResult {
  success: boolean;
  finalShortUrl?: string;
  code?: string;
  id?: string;
  error?: {
    code: string;
    message: string;
    stage: 'stage1' | 'stage2';
  };
}

class VpsShortenerService {
  /**
   * Retrieves the centralized VPS Backend API Base URL from environment variables or saved config
   */
  public getBackendBaseUrl(): string {
    const envUrl = (import.meta as any).env?.VITE_BACKEND_API_BASE_URL || 
                   (import.meta as any).env?.VITE_BACKEND_API_URL;
    if (envUrl) {
      return envUrl.replace(/\/+$/, '');
    }
    return apiClient.getConfig().baseUrl.replace(/\/+$/, '');
  }

  public isMockFallbackEnabled(): boolean {
    return localStorage.getItem('linkpro_vps_mock_fallback') === 'true';
  }

  public setMockFallbackEnabled(enabled: boolean): void {
    localStorage.setItem('linkpro_vps_mock_fallback', enabled ? 'true' : 'false');
  }

  /**
   * Dispatches Stage 1 short URL and original long URL to VPS shorten.php
   */
  public async callVpsShorten(
    stage1ShortUrl: string,
    originalLongUrl: string
  ): Promise<VpsFinalShortenResult> {
    // 1. Pre-flight Validation
    try {
      const parsedOriginal = new URL(originalLongUrl);
      if (!['http:', 'https:'].includes(parsedOriginal.protocol)) {
        return {
          success: false,
          error: {
            code: 'INVALID_ORIGINAL_URL',
            message: 'Original URL must be a valid HTTP or HTTPS web address.',
            stage: 'stage1',
          },
        };
      }
    } catch {
      return {
        success: false,
        error: {
          code: 'MALFORMED_ORIGINAL_URL',
          message: 'The original destination URL format is invalid.',
          stage: 'stage1',
        },
      };
    }

    try {
      const parsedStage1 = new URL(stage1ShortUrl);
      if (!['http:', 'https:'].includes(parsedStage1.protocol)) {
        return {
          success: false,
          error: {
            code: 'INVALID_STAGE1_URL',
            message: 'Stage 1 short URL must be a valid HTTP or HTTPS address.',
            stage: 'stage1',
          },
        };
      }
    } catch {
      return {
        success: false,
        error: {
          code: 'MALFORMED_STAGE1_URL',
          message: 'Stage 1 generated short URL is malformed.',
          stage: 'stage1',
        },
      };
    }

    // 2. Prepare Payload
    const payload: VpsShortenRequest = {
      short_url: stage1ShortUrl,
      original_url: originalLongUrl,
    };

    const baseUrl = this.getBackendBaseUrl();
    const config = apiClient.getConfig();

    // Determine target endpoint
    const endpoint = config.useProxy 
      ? `${config.proxyEndpoint}/shorten.php`
      : `${baseUrl}/shorten.php`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs || 9000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'LinkPro-Stage2-Shortener',
    };

    if (config.apiToken) {
      headers['Authorization'] = `Bearer ${config.apiToken}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle Authentication / Authorization status codes
      if (response.status === 401) {
        return {
          success: false,
          error: {
            code: 'AUTHENTICATION_REQUIRED',
            message: 'VPS Backend: Authentication required to create links on shorten.php.',
            stage: 'stage2',
          },
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: {
            code: 'SUBSCRIPTION_OR_PERMISSION_DENIED',
            message: 'VPS Backend: Access forbidden. Your account is suspended or your subscription package quota has expired.',
            stage: 'stage2',
          },
        };
      }

      if (response.status === 422) {
        const errJson = await response.json().catch(() => null);
        return {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: errJson?.message || errJson?.msg || 'VPS Backend: Submitted URL parameters failed validation.',
            stage: 'stage2',
          },
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: `VPS Backend HTTP error (${response.status}) on /shorten.php.`,
            stage: 'stage2',
          },
        };
      }

      const jsonText = await response.text();
      let resData: VpsShortenResponse;
      try {
        resData = JSON.parse(jsonText);
      } catch {
        return {
          success: false,
          error: {
            code: 'INVALID_JSON_RESPONSE',
            message: `VPS Backend returned invalid JSON on /shorten.php: ${jsonText.substring(0, 100)}`,
            stage: 'stage2',
          },
        };
      }

      // Check error: 0 requirement
      if (resData.error !== 0 && resData.error !== undefined) {
        return {
          success: false,
          error: {
            code: `BACKEND_ERROR_${resData.error}`,
            message: resData.msg || resData.message || `VPS Backend returned error code ${resData.error}.`,
            stage: 'stage2',
          },
        };
      }

      // Extract final short URL (supports both 'shorturl' and 'short_url')
      const finalUrl = resData.shorturl || resData.short_url;
      if (!finalUrl) {
        return {
          success: false,
          error: {
            code: 'MISSING_SHORT_URL',
            message: 'VPS Backend response did not contain "shorturl" or "short_url" field.',
            stage: 'stage2',
          },
        };
      }

      // Validate that final URL is a real HTTP/HTTPS URL
      try {
        const parsedFinal = new URL(finalUrl);
        if (!['http:', 'https:'].includes(parsedFinal.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch {
        return {
          success: false,
          error: {
            code: 'INVALID_FINAL_URL',
            message: `VPS Backend returned a malformed short URL: ${finalUrl}`,
            stage: 'stage2',
          },
        };
      }

      return {
        success: true,
        finalShortUrl: finalUrl,
        code: resData.code,
        id: resData.id,
      };

    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        return {
          success: false,
          error: {
            code: 'STAGE2_TIMEOUT',
            message: `Request to VPS /shorten.php timed out after ${config.timeoutMs || 9000}ms.`,
            stage: 'stage2',
          },
        };
      }

      // If mock fallback is enabled by developer for testing when VPS is offline
      if (this.isMockFallbackEnabled()) {
        const code = 'vps_' + Math.random().toString(36).substring(2, 8);
        const finalMock = `${baseUrl}/${code}`;
        return {
          success: true,
          finalShortUrl: finalMock,
          code,
          id: 'vps_' + Date.now(),
        };
      }

      // If network fails (e.g. VPS endpoint unreachable, offline, or CORS blocked in browser)
      return {
        success: false,
        error: {
          code: 'STAGE2_NETWORK_FAILURE',
          message: `Failed to connect to VPS /shorten.php (${endpoint}). Check VPS status, CORS, or use Cloudflare proxy. (${err.message})`,
          stage: 'stage2',
        },
      };
    }
  }

  /**
   * Diagnostic test method for VPS /shorten.php endpoint with latency tracking
   */
  public async testVpsShortenEndpoint(testStage1Url: string, testOriginalUrl: string): Promise<{
    reachable: boolean;
    latencyMs: number;
    requestPayload: VpsShortenRequest;
    responseStatus?: number;
    responseBody?: any;
    error?: string;
  }> {
    const startTime = performance.now();
    const payload: VpsShortenRequest = {
      short_url: testStage1Url,
      original_url: testOriginalUrl,
    };

    const baseUrl = this.getBackendBaseUrl();
    const config = apiClient.getConfig();
    const endpoint = config.useProxy 
      ? `${config.proxyEndpoint}/shorten.php`
      : `${baseUrl}/shorten.php`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'LinkPro-Diagnostic-Test',
          ...(config.apiToken ? { 'Authorization': `Bearer ${config.apiToken}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const latencyMs = Math.round(performance.now() - startTime);
      const text = await response.text();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      return {
        reachable: response.ok,
        latencyMs,
        requestPayload: payload,
        responseStatus: response.status,
        responseBody: parsed,
        error: !response.ok ? `HTTP ${response.status}: ${typeof parsed === 'string' ? parsed : (parsed.msg || parsed.message || 'Error')}` : undefined
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return {
        reachable: false,
        latencyMs,
        requestPayload: payload,
        error: err.message || 'Network request failed'
      };
    }
  }
}

export const vpsShortenerService = new VpsShortenerService();
