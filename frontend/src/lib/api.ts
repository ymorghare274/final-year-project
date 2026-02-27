import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const authData = localStorage.getItem('auth-storage');
            if (authData) {
                try {
                    const { state } = JSON.parse(authData);
                    const token = state.user?.token;
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    } else {
                        console.warn('No token found in auth-storage');
                    }
                } catch (e) {
                    console.error('Error parsing auth-storage', e);
                }
            } else {
                console.warn('No auth-storage found in localStorage');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Potentially clear stale auth data and redirect to login
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
                localStorage.removeItem('auth-storage');
                window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
            }
        }
        return Promise.reject(error);
    }
);

export default api;