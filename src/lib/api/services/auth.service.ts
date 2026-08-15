import { fetchGraphQL, ApiResponse } from "../client";

export type UserRole = "alumni" | "student" | "admin";
export type AccountStatus = "active" | "suspended" | "pending";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  verificationRejectionReason?: string | null;
  headline?: string | null;
  about?: string | null;
  location?: string | null;
  graduationYear?: number | null;
  programme?: string | null;
  department?: string | null;
  faculty?: string | null;
  industry?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  skills: string[];
  openToWork: boolean;
  openToMentor: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "alumni" | "student";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name?: string;
  headline?: string;
  about?: string;
  location?: string;
  graduationYear?: number;
  programme?: string;
  department?: string;
  faculty?: string;
  industry?: string;
  company?: string;
  jobTitle?: string;
  skills?: string[];
  openToWork?: boolean;
  openToMentor?: boolean;
  avatarFileId?: string;
}

export const USER_FIELDS = `
  id
  name
  email
  role
  accountStatus
  verificationStatus
  verificationRejectionReason
  headline
  about
  location
  graduationYear
  programme
  department
  faculty
  industry
  company
  jobTitle
  skills
  openToWork
  openToMentor
  avatarUrl
  createdAt
  updatedAt
`;

export const authApi = {
  async register(input: RegisterInput): Promise<ApiResponse<{ register: AuthPayload }>> {
    return fetchGraphQL<{ register: AuthPayload }>(
      `mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user { ${USER_FIELDS} }
        }
      }`,
      { input }
    );
  },

  async login(input: LoginInput): Promise<ApiResponse<{ login: AuthPayload }>> {
    return fetchGraphQL<{ login: AuthPayload }>(
      `mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user { ${USER_FIELDS} }
        }
      }`,
      { input }
    );
  },

  async me(token?: string): Promise<ApiResponse<{ me: AuthUser | null }>> {
    return fetchGraphQL<{ me: AuthUser | null }>(
      `query Me { me { ${USER_FIELDS} } }`,
      undefined,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
  },
};
