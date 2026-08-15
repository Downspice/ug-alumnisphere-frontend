import type { AuthUser, VerificationStatus } from "./auth.service";

export type DirectoryUser = Pick<
  AuthUser,
  | "id"
  | "name"
  | "email"
  | "role"
  | "verificationStatus"
  | "headline"
  | "about"
  | "location"
  | "graduationYear"
  | "programme"
  | "department"
  | "faculty"
  | "industry"
  | "company"
  | "jobTitle"
  | "skills"
  | "openToWork"
  | "openToMentor"
  | "avatarUrl"
>;

export type DirectorySort = "RECENT" | "NAME_ASC" | "YEAR_DESC";

export interface DirectoryFilter {
  query?: string;
  graduationYear?: number;
  programme?: string;
  department?: string;
  faculty?: string;
  industry?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  skill?: string;
  openToMentor?: boolean;
  openToWork?: boolean;
  verificationStatus?: VerificationStatus;
}

export interface DirectoryPage {
  items: DirectoryUser[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface VerificationRequest {
  id: string;
  graduationYear: number;
  programme: string;
  studentNumber: string;
  notes?: string | null;
  documentFileName?: string | null;
  documentDownloadUrl?: string | null;
  status: VerificationStatus;
  rejectionReason?: string | null;
  createdAt: string;
  applicant?: Pick<
    AuthUser,
    "id" | "name" | "email" | "role" | "verificationStatus" | "programme" | "graduationYear"
  >;
}

export type ConnectionStatus = "pending" | "accepted" | "declined";

export interface ConnectionRecord {
  id: string;
  status: ConnectionStatus;
  createdAt?: string;
  updatedAt?: string;
  requester?: DirectoryUser;
  addressee?: DirectoryUser;
}

export interface SuggestedConnection {
  user: DirectoryUser;
  reasons: string[];
}
