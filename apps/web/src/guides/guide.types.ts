import type { Placement } from "react-joyride";

export type GuideCategory =
  | "getting-started"
  | "blog"
  | "news"
  | "resources"
  | "services"
  | "inquiries"
  | "seo"
  | "linkedin"
  | "settings"
  | "security";

export type GuideDifficulty = "basic" | "intermediate" | "advanced";

export interface GuideStep {
  target: string;
  title: string;
  content: string;
  placement?: Placement;
}

export interface GuideDefinition {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  difficulty: GuideDifficulty;
  estimatedMinutes: number;
  routeToStart: string;
  steps: GuideStep[];
  adminOnly?: boolean;
}
