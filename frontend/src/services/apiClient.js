import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // For receiving secure HTTP-only cookies if needed, or sending cross-origin
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Inject Token from Cookies/LocalStorage)
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Handle global 401 Unauthorized errors)
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || { status: 'error', message: 'Network Error' });
    }
);

export default api;
