import type { ClinicalService, Inquiry, NewsItem, Post, Resource, SiteSettings } from "@doctor-tebar/shared";
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
