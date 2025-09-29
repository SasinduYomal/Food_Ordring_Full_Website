import config from './config';

class APIService {
  constructor() {
    this.baseURL = config.API_BASE_URL || 'http://localhost:5000/api';
  }

  setToken(token) {
    console.log('APIService: Setting token', token ? `${token.substring(0, 20)}...` : 'null');
    localStorage.setItem('adminToken', token);
  }

  removeToken() {
    console.log('APIService: Removing token');
    localStorage.removeItem('adminToken');
  }

  // Get token from localStorage (always the latest)
  getToken() {
    return localStorage.getItem('adminToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...(options.headers || {}) };

    // Only set JSON Content-Type if body is not FormData
    const isFormData = options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Get fresh token from localStorage
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = { ...options, headers };

    try {
      console.log('APIService: Making request to', url, config);
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized responses (token expired)
      if (response.status === 401) {
        console.log('APIService: Unauthorized request, removing token');
        // Remove token from localStorage
        localStorage.removeItem('adminToken');
        // Redirect to login page
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      
      if (!response.ok) {
        let message = 'Request failed';
        try {
          const data = await response.json();
          message = data.message || message;
        } catch (_) {
          message = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error('APIService: Request failed', message);
        throw new Error(message);
      }
      
      // Some endpoints may return 204
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return null;
      }
      
      const data = await response.json();
      console.log('APIService: Request successful', data);
      return data;
    } catch (error) {
      console.error('APIService: Request error', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, data) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { method: 'PUT', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new APIService();