import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.endsWith('/api')) {
    baseURL = import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auto-logout if backend returns 401 (deleted/invalid user)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const hadToken = !!sessionStorage.getItem('token');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            if (hadToken) {
                sessionStorage.setItem('accountDeleted', 'true');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
