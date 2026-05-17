import type { ClinicalService, Inquiry, NewsItem, Post, Resource, SiteSettings, TrainingChatMessage, TrainingCourse } from "@doctor-tebar/shared";
import { apiClient } from "./apiClient";

export async function getPosts(params?: Record<string, string>) {
  const { data } = await apiClient.get<Post[]>("/posts", { params });
  return data;
}

export async function getPost(slug: string) {
  const { data } = await apiClient.get<Post>(`/posts/${slug}`);
  return data;
}

export async function getNews() {
  const { data } = await apiClient.get<NewsItem[]>("/news");
  return data;
}

export async function getNewsItem(slug: string) {
  const { data } = await apiClient.get<NewsItem>(`/news/${slug}`);
  return data;
}

export async function getResources() {
  const { data } = await apiClient.get<Resource[]>("/resources");
  return data;
}

export async function getServices() {
  const { data } = await apiClient.get<ClinicalService[]>("/services");
  return data;
}

export async function getTrainingCourses() {
  const { data } = await apiClient.get<TrainingCourse[]>("/training");
  return data;
}

export async function getTrainingCourse(slug: string) {
  const { data } = await apiClient.get<TrainingCourse>(`/training/${slug}`);
  return data;
}

export async function createTrainingChatMessage(slug: string, payload: unknown) {
  const { data } = await apiClient.post<TrainingChatMessage>(`/training/${slug}/chat`, payload);
  return data;
}

export async function getSettings() {
  const { data } = await apiClient.get<SiteSettings>("/settings/public");
  return data;
}

export async function createInquiry(payload: unknown) {
  const { data } = await apiClient.post<Inquiry>("/inquiries", payload);
  return data;
}

export async function adminList<T>(path: string) {
  const { data } = await apiClient.get<T[]>(`/admin/${path}`);
  return data;
}

export async function adminGet<T>(path: string, id: string) {
  const { data } = await apiClient.get<T>(`/admin/${path}/${id}`);
  return data;
}

export async function adminCreate<T>(path: string, payload: unknown) {
  const { data } = await apiClient.post<T>(`/admin/${path}`, payload);
  return data;
}

export async function adminUpdate<T>(path: string, id: string, payload: unknown) {
  const { data } = await apiClient.put<T>(`/admin/${path}/${id}`, payload);
  return data;
}

export async function adminDelete(path: string, id: string) {
  await apiClient.delete(`/admin/${path}/${id}`);
}

export async function adminPatch<T>(path: string, id: string, action: string, payload?: unknown) {
  const { data } = await apiClient.patch<T>(`/admin/${path}/${id}/${action}`, payload);
  return data;
}

export async function updateSettings(payload: unknown) {
  const { data } = await apiClient.put<SiteSettings>("/admin/settings", payload);
  return data;
}

export interface ChatMetrics {
  total: number;
  open: number;
  byFormation: { courseTitle: string; courseSlug: string; total: number; open: number; distinctUserCount: number }[];
  byUser: { _id: string; name: string; email: string; totalMessages: number; openMessages: number; distinctCourses: number; lastActivity: string; courses: { title: string; slug: string; count: number }[] }[];
  usersWithMultipleCourses: number;
}

export async function getAdminChatMetrics() {
  console.log("[CHAT ADMIN] Cargando métricas");
  const { data } = await apiClient.get<ChatMetrics>("/admin/chat/metrics");
  return data;
}

export async function getAdminChatMessages(params?: { course?: string; user?: string; topic?: string; status?: string }) {
  console.log("[CHAT ADMIN] Cargando conversaciones", params);
  const { data } = await apiClient.get<TrainingChatMessage[]>("/admin/chat", { params });
  console.log("[CHAT ADMIN] Conversaciones recibidas:", data.length);
  return data;
}

export async function updateChatMessageStatus(id: string, status: string) {
  const { data } = await apiClient.patch<TrainingChatMessage>(`/admin/chat/${id}/status`, { status });
  return data;
}

export async function deleteChatMessage(id: string) {
  await apiClient.delete(`/admin/chat/${id}`);
}

export async function getAdminTrainingCourses() {
  const { data } = await apiClient.get<TrainingCourse[]>("/admin/training");
  return data;
}

export async function uploadMedia(file: File) {
  const body = new FormData();
  body.append("file", file);
  const { data } = await apiClient.post<{
    _id: string;
    url: string;
    mimeType: string;
    originalName?: string;
  }>("/admin/media/upload", body, { headers: { "Content-Type": "multipart/form-data" } });
  return data;
}
