import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to get CSRF token from cookie
const getCSRFToken = () => {
  if (typeof document === 'undefined') return null;
  const name = 'XSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

// Function to fetch CSRF token
const fetchCSRFToken = async () => {
  try {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/csrf-token`, {
      withCredentials: true
    });
    const token = getCSRFToken();
    if (!token) {
      throw new Error('Failed to get CSRF token from cookie');
    }
    return token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    if (config.method && config.method.toLowerCase() !== 'get') {
      try {
        const token = await fetchCSRFToken();
        config.headers['X-CSRF-Token'] = token;
      } catch (error) {
        console.error('Error setting CSRF token:', error);
        throw error;
      }
    }

    const authToken = localStorage.getItem('token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle CSRF token errors
    if (error.response?.status === 403 && error.response?.data?.error === 'Invalid CSRF token') {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await fetchCSRFToken();
          const newToken = getCSRFToken();
          if (newToken) {
            originalRequest.headers['X-CSRF-Token'] = newToken;
            return api(originalRequest);
          }
        } catch (retryError) {
          console.error('Error retrying request with new CSRF token:', retryError);
        }
      }
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/signin';
    }

    return Promise.reject(error);
  }
);

// Initialize CSRF token when the module loads
if (typeof window !== 'undefined') {
  fetchCSRFToken().catch(console.error);
}

export default api;
