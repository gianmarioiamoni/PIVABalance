import axios from 'axios';

// Create a new axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

// Function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Function to get CSRF token
const getCsrfToken = async () => {
    try {
        await axiosInstance.get('/api/csrf-token');
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        return token;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
    }
};

// Add request interceptor to include credentials, auth token and CSRF token
axiosInstance.interceptors.request.use(async (config) => {
    // Always include credentials
    config.withCredentials = true;

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // For mutations (non-GET requests), include CSRF token
    if (config.method !== 'get') {
        const csrfToken = await getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
    }

    return config;
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the auth token or redirect to login
                const token = getAuthToken();
                if (!token) {
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Get a new CSRF token and retry
                const csrfToken = await getCsrfToken();
                if (csrfToken) {
                    originalRequest.headers['X-CSRF-Token'] = csrfToken;
                    return axiosInstance(originalRequest);
                }
            } catch (retryError) {
                console.error('Error retrying request:', retryError);
                // If refresh fails, redirect to login
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export { axiosInstance };
