const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

let accessToken = null;

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

      // Handle 401 - try refresh
      if (response.status === 401 && accessToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            accessToken = refreshData.accessToken;
            headers.Authorization = `Bearer ${accessToken}`;

            // Retry original request
            return fetch(`${API_BASE_URL}${url}`, {
              method,
              credentials: 'include',
              headers,
              body: options.body ? JSON.stringify(options.body) : undefined
            });
          }
        } catch (error) {
          accessToken = null;
          window.location.href = '/login';
          throw error;
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        const err = new Error(error.error || `HTTP ${response.status}`);
        err.response = { status: response.status, data: error };
        throw err;
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  get(url, options = {}) {
    return this.request('GET', url, options).then(r => r.json());
  },

  post(url, body, options = {}) {
    return this.request('POST', url, { ...options, body }).then(r => r.json());
  },

  put(url, body, options = {}) {
    return this.request('PUT', url, { ...options, body }).then(r => r.json());
  },

  delete(url, options = {}) {
    return this.request('DELETE', url, options).then(r => r.json());
  }
};

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export default apiClient;
