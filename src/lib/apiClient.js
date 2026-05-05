const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

let accessToken = null;
let refreshPromise = null;

const parseErrorResponse = async (response) => {
  const error = await response.json().catch(() => ({ error: 'Request failed' }));
  const err = new Error(error.error || `HTTP ${response.status}`);
  err.response = { status: response.status, data: error };
  return err;
};

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!refreshResponse.ok) {
        accessToken = null;
        return null;
      }

      const refreshData = await refreshResponse.json().catch(() => ({}));
      accessToken = refreshData.accessToken || null;
      return accessToken;
    } catch {
      // Keep current session state unchanged on transient network errors.
      return accessToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const apiClient = {
  async request(method, url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method,
        credentials: 'include',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      const isRefreshRequest = url === '/auth/refresh';

      // Handle 401 by attempting refresh and retrying once.
      if (response.status === 401 && !isRefreshRequest) {
        const refreshedToken = await refreshAccessToken();

        if (refreshedToken) {
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${refreshedToken}`
          };

          const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
            method,
            credentials: 'include',
            headers: retryHeaders,
            body: options.body ? JSON.stringify(options.body) : undefined
          });

          if (!retryResponse.ok) {
            throw await parseErrorResponse(retryResponse);
          }

          return retryResponse;
        }
      }

      if (!response.ok) {
        throw await parseErrorResponse(response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  get(url, options = {}) {
    return this.request('GET', url, options).then(r => {
      const contentType = r.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return r.json();
      }
      return r.text();
    });
  },

  post(url, body, options = {}) {
    return this.request('POST', url, { ...options, body }).then(r => {
      const contentType = r.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return r.json();
      }
      return r.text();
    });
  },

  put(url, body, options = {}) {
    return this.request('PUT', url, { ...options, body }).then(r => {
      const contentType = r.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return r.json();
      }
      return r.text();
    });
  },

  delete(url, options = {}) {
    return this.request('DELETE', url, options).then(r => {
      const contentType = r.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return r.json();
      }
      return r.text();
    });
  }
};

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export default apiClient;
