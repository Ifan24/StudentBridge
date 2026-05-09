export type StudentProfileView = {
  id: string;
  city: string;
  institution: string;
  studyArea: string;
  arrivalStage: string;
  goals: string[];
  languages: string[];
  preferredEventTypes: string[];
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  nextDate?: string;
  location: string;
  city: string;
  category: string;
  isFree: boolean;
  host: string;
  imageUrl?: string;
  sourceUrl: string;
  tags: string[];
};

export type ForumTopicView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
};

export type ForumCommentView = {
  id: string;
  body: string;
  authorName: string;
  helpfulCount: number;
  createdAt: string;
};

export type ForumPostView = {
  id: string;
  title: string;
  body: string;
  city: string;
  tags: string[];
  status: string;
  helpfulCount: number;
  replyCount: number;
  topic: ForumTopicView;
  authorName: string;
  comments: ForumCommentView[];
  createdAt: string;
};

export type JobOpportunityView = {
  id: string;
  title: string;
  company: string;
  verified: boolean;
  city: string;
  workType: string;
  industry: string;
  experienceLevel: string;
  workRightsFriendly: boolean;
  paid: boolean;
  closingDate?: string | null;
  description: string;
  tags: string[];
  applyUrl: string;
};

export type SupportResourceView = {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  official: boolean;
  tags: string[];
};

export type SavedItemType = "event" | "post" | "job" | "support";

export type SavedItemSummary = {
  total: number;
  counts: Record<SavedItemType, number>;
};

export type SubscriptionPlanView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceMonthlyCents: number;
  aiMonthlyLimit: number;
  features: string[];
  highlighted: boolean;
};

export type SubscriptionStateView = {
  activePlanSlug: string;
  aiUsedThisMonth: number;
  periodLabel: string;
  plans: SubscriptionPlanView[];
};

export type AiCard = {
  title: string;
  body: string;
  source: "app-data" | "city-of-sydney" | "official-link" | "ai";
  actionLabel?: string;
};

export type AiResponse = {
  summary: string;
  safetyNote?: string;
  cards: AiCard[];
};
