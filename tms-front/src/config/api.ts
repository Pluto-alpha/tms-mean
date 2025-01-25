import { store } from '../redux/store';
import { refreshToken } from '../features/auth/authSlice';
import API from './base';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Attach request interceptor
API.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Attach response interceptor
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return API(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const { payload } = await store.dispatch(refreshToken() as any);
                const newAccessToken = payload?.accessToken;
                if (newAccessToken) {
                    API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                }
                return API(originalRequest);
            } catch (err) {
                processQueue(err, null);
                store.dispatch({ type: 'auth/logout' });
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
