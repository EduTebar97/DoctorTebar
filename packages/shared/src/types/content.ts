import type {
  contentStatuses,
  inquiryStages,
  objectiveTypes,
  postCategories,
  resourceTypes
} from "../constants/content.js";

export type ContentStatus = (typeof contentStatuses)[number];
export type PostCategory = (typeof postCategories)[number];
export type ResourceType = (typeof resourceTypes)[number];
export type InquiryStage = (typeof inquiryStages)[number];
export type ObjectiveType = (typeof objectiveTypes)[number];

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "reviewer" | "viewer";
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: PostCategory;
  tags: string[];
  status: ContentStatus;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  status: ContentStatus;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  _id: string;
  title: string;
  description: string;
  type: ResourceType;
  fileUrl?: string;
  externalUrl?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalService {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  deliverables: string[];
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  organization?: string;
  projectStage: InquiryStage;
  objectiveType: ObjectiveType;
  message: string;
  status: "new" | "reviewed" | "pending_reply" | "replied" | "meeting_proposed" | "proposal_sent" | "accepted" | "discarded" | "archived";
  internalNotes?: string;
  priority?: "low" | "medium" | "high";
  estimatedValue?: number;
  nextAction?: string;
  nextActionAt?: string;
  source?: "contact_form" | "linkedin" | "email" | "referral" | "other";
  serviceInterest?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  _id: string;
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  linkedinUrl?: string;
  accentColor?: string;
  updatedAt: string;
}
