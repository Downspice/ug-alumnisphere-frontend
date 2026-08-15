import type { DirectoryUser } from "./network.service";

export type JobType = "full_time" | "part_time" | "internship" | "contract";
export type JobStatus = "open" | "closed";
export type JobSort = "RECENT" | "TITLE_ASC";
export type ApplicationStatus = "submitted" | "reviewing" | "shortlisted" | "rejected" | "withdrawn";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  industry: string;
  description: string;
  requirements: string;
  applicationUrl?: string | null;
  status: JobStatus;
  savedByMe: boolean;
  applicationCount: number;
  createdAt: string;
  postedBy?: Pick<DirectoryUser, "id" | "name"> | null;
  myApplication?: JobApplication | null;
}

export interface JobApplication {
  id: string;
  status: ApplicationStatus;
  coverNote: string;
  resumeFileName?: string | null;
  resumeDownloadUrl?: string | null;
  createdAt: string;
  job?: Job;
  applicant?: DirectoryUser | null;
}

export type MentorshipRequestStatus = "pending" | "accepted" | "declined";

export interface MentorshipRequest {
  id: string;
  status: MentorshipRequestStatus;
  message: string;
  createdAt?: string;
  mentee?: DirectoryUser | null;
  mentor?: DirectoryUser | null;
}

export interface MentorshipGoal {
  id: string;
  text: string;
  done: boolean;
}

export interface Mentorship {
  id: string;
  status: "active" | "closed" | string;
  createdAt: string;
  mentor?: DirectoryUser | null;
  mentee?: DirectoryUser | null;
  goals: MentorshipGoal[];
}

export type EventStatus = "draft" | "published" | "cancelled";

export interface AlumniEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt?: string | null;
  capacity?: number | null;
  status: EventStatus;
  registeredCount: number;
  registeredByMe: boolean;
  createdAt: string;
  createdBy?: Pick<DirectoryUser, "id" | "name"> | null;
}

export interface EventRegistration {
  id: string;
  createdAt: string;
  event: AlumniEvent;
}
