/**
 * Render Backend Service for ShelterTherm
 * Backend base URL: https://sheltertherm-backend.onrender.com
 */

export const BACKEND_URL = 'https://sheltertherm-backend.onrender.com';

export interface BackendHealthResponse {
  status: string;
  timestamp?: string;
  version?: string;
  uptime?: number;
}

export interface BackendDashboardData {
  indoorTemperature?: number;
  outdoorTemperature?: number;
  solarGain?: number;
  heatLoss?: number;
  thermalStorage?: number;
  thermalAutonomy?: number;
  windSpeed?: number;
  nightMin?: number;
  [key: string]: unknown;
}

/**
 * Checks the health status of the Render backend.
 * Uses a 5-second timeout and gracefully catches network errors
 * (e.g. if Render service is cold-starting or offline).
 */
export async function checkBackendHealth(): Promise<{ isHealthy: boolean; details?: BackendHealthResponse }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    }).catch(async () => {
      // Fallback probe to root
      return await fetch(`${BACKEND_URL}/`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json().catch(() => ({ status: 'ok' }));
      return { isHealthy: true, details: data };
    }
    return { isHealthy: false };
  } catch (error) {
    // Non-fatal, gracefully return offline status
    return { isHealthy: false };
  }
}

/**
 * Fetches dashboard telemetry from the Render backend.
 * If the project does not exist on the remote backend or the call fails,
 * returns null so the client seamlessly uses the project's local dynamic data.
 */
export async function fetchBackendDashboard(projectId?: string): Promise<BackendDashboardData | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = projectId
      ? `${BACKEND_URL}/api/dashboard?projectId=${encodeURIComponent(projectId)}`
      : `${BACKEND_URL}/api/dashboard`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
  } catch {
    // Graceful fallback to project's local data
    return null;
  }
}
