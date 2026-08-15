import type { DirectoryUser } from "./network.service";

export interface Conversation {
  id: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  participants: DirectoryUser[];
}

export interface ChatMessage {
  id: string;
  body: string;
  createdAt: string;
  sender: Pick<DirectoryUser, "id" | "name" | "avatarUrl">;
}

export type CommunityRole = "owner" | "moderator" | "member";

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
  myRole?: CommunityRole | null;
  joinRequestPending: boolean;
  coverImageUrl?: string | null;
  createdAt: string;
  owner?: Pick<DirectoryUser, "id" | "name"> | null;
}

export interface CommunityMember {
  id: string;
  role: CommunityRole;
  createdAt: string;
  user?: DirectoryUser | null;
}

export interface CommunityJoinRequest {
  id: string;
  status: string;
  createdAt: string;
  user?: DirectoryUser | null;
}

export type PostType = "text" | "link" | "poll" | "image";

export interface PollOption {
  text: string;
  voteCount: number;
}

export interface Post {
  id: string;
  type: PostType;
  body: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  pollQuestion?: string | null;
  pollOptions: PollOption[];
  pollClosesAt?: string | null;
  pollClosed: boolean;
  pollTotalVotes: number;
  myPollVote?: number | null;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  createdAt: string;
  updatedAt: string;
  author?: DirectoryUser | null;
  community?: Pick<Community, "id" | "name" | "isPrivate"> | null;
}

export interface PostComment {
  id: string;
  parentId?: string | null;
  body: string;
  createdAt: string;
  author?: Pick<DirectoryUser, "id" | "name" | "avatarUrl"> | null;
}

export interface CreatePostInput {
  communityId?: string;
  type: PostType;
  body?: string;
  linkUrl?: string;
  pollQuestion?: string;
  pollOptions?: string[];
  pollClosesAt?: string;
  imageFileId?: string;
}
