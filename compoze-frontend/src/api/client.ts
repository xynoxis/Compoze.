const BASE_URL = 'http://localhost:8080/api';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string>;
}

let isRefreshing = false;

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = localStorage.getItem('compoze_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  // Automatic token refresh handling on 401/403 expired access token
  if (
    (response.status === 401 || response.status === 403) &&
    !isRetry &&
    endpoint !== '/auth/refresh' &&
    endpoint !== '/auth/login' &&
    endpoint !== '/auth/register'
  ) {
    const refreshToken = localStorage.getItem('compoze_refresh_token');
    if (refreshToken && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData?.accessToken) {
            localStorage.setItem('compoze_token', refreshData.accessToken);
            if (refreshData.refreshToken) {
              localStorage.setItem('compoze_refresh_token', refreshData.refreshToken);
            }
            isRefreshing = false;
            // Retry the original API request transparently with the new access token
            return apiRequest<T>(endpoint, options, true);
          }
        } else {
          // Refresh token expired or invalid: clear stale auth
          localStorage.removeItem('compoze_token');
          localStorage.removeItem('compoze_refresh_token');
        }
      } catch (err) {
        localStorage.removeItem('compoze_token');
        localStorage.removeItem('compoze_refresh_token');
      } finally {
        isRefreshing = false;
      }
    }
  }

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const error: ApiError = {
      message: data?.message || data?.error || 'An error occurred during the request',
      status: response.status,
      errors: data?.errors,
    };
    throw error;
  }

  return data as T;
}
