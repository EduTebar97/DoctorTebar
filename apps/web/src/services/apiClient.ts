import axios from "axios";

const authTokenKey = "doctor_tebar_admin_token";
const isDev = import.meta.env.DEV;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true
});

export function getAuthToken() {
  return window.localStorage.getItem(authTokenKey);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(authTokenKey, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(authTokenKey);
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (isDev) {
    console.debug("[API] Request enviada", {
      method: config.method?.toUpperCase(),
      endpoint: config.url,
      tokenPresent: Boolean(token)
    });
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    if (status === 401 && url !== "/auth/me") clearAuthToken();
    if (isDev) {
      const log = status === 401 ? console.warn : console.error;
      log(status === 401 ? "[API] Error 401 controlado" : "[API] Error recibido", {
        status,
        endpoint: url,
        details: error.response?.data ?? error.message
      });
    }
    return Promise.reject(error);
  }
);
