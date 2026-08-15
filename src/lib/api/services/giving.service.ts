export type CampaignStatus = "draft" | "active" | "closed";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  remainingAmount: number;
  progressPercent: number;
  contributorCount: number;
  deadline?: string | null;
  status: CampaignStatus;
  createdAt: string;
  createdBy?: { id: string; name: string } | null;
}

export interface ContributionRecord {
  id: string;
  amount: number;
  anonymous: boolean;
  note: string;
  status: string;
  createdAt: string;
  campaign?: Campaign;
  contributor?: { id: string; name: string } | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export interface AdminOverview {
  users: number;
  jobs: number;
  applications: number;
  events: number;
  registrations: number;
  communities: number;
  campaigns: number;
  contributions: number;
  openReports: number;
  pendingVerifications: number;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
  goal?: number | null;
}

export interface AdminAnalytics {
  source: string;
  usersByRole: AnalyticsPoint[];
  jobsByType: AnalyticsPoint[];
  eventsByStatus: AnalyticsPoint[];
  campaignProgress: AnalyticsPoint[];
  contributionsByMonth: AnalyticsPoint[];
}

export interface ContentReport {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter?: { id: string; name: string; email?: string } | null;
}
