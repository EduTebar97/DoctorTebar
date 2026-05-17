import { apiClient, clearAuthToken, setAuthToken } from "./apiClient";
import { AxiosError } from "axios";

type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
};

export async function login(email: string, password: string) {
  console.info("[AUTH] Intentando iniciar sesion", { emailPresent: Boolean(email) });
  const { data } = await apiClient.post<LoginResponse>("/auth/login", { email, password });
  if (data.token) setAuthToken(data.token);
  console.info("[AUTH] Usuario autenticado", { role: data.user.role, tokenPresent: Boolean(data.token) });
  console.info("[AUTH] Rol del usuario", { role: data.user.role });
  return data;
}

export async function logout() {
  try {
    const { data } = await apiClient.post("/auth/logout");
    return data;
  } finally {
    clearAuthToken();
  }
}

export async function getMe() {
  console.info("[AUTH] Comprobando sesión con /api/auth/me");
  try {
    const { data } = await apiClient.get("/auth/me");
    console.info("[AUTH] /api/auth/me OK", { authenticated: Boolean(data.user), role: data.user?.role });
    if (data.user) console.info("[AUTH] Usuario autenticado", { role: data.user.role });
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      console.warn("[AUTH] /api/auth/me devolvió 401");
      console.warn("[AUTH] Usuario no autenticado");
      return { user: null };
    }
    throw error;
  }
}
