/**
 * Bazziba Next.js - Shared Types
 */

import { NextRequest } from "next/server";

// ============= Auth Types =============
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  bio?: string | null;
  image?: string | null;
  role: "USER" | "CREATOR" | "ADMIN" | "MODERATOR";
  videoCount: number;
  followerCount: number;
  viewCount: number;
  points: number;
  createdAt: Date;
  lastActive: Date;
}

export interface Session {
  user: {
    id: string;
    email: string;
    username: string;
    name?: string | null;
    image?: string | null;
    role: "USER" | "CREATOR" | "ADMIN" | "MODERATOR";
  };
  expires: string;
}

// ============= Video Types =============
export interface Video {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  thumbnail?: string | null;
  videoUrl?: string | null;
  videoProvider?: string | null;
  playbackId?: string | null;
  duration?: number | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  width?: number | null;
  height?: number | null;
  size?: string | null;
  status: "DRAFT" | "PROCESSING" | "PUBLISHED" | "ARCHIVED";
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  allowComments: boolean;
  authorId: string;
  categoryId?: string | null;
  categories?: Category[];
  tags?: Tag[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  
  // Computed/derived
  author?: User;
  contestEntry?: ContestEntry | null;
  liked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  order: number;
  videoCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface VideoFormat {
  quality: string;
  url: string;
  bitrate?: number;
}

// ============= Comment Types =============
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  videoId: string;
  parentId?: string | null;
  replies?: Comment[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
  likeCount: number;
  liked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============= Contest Types =============
export interface Contest {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  status: "UPCOMING" | "PREREGISTRATION" | "ACTIVE" | "VOTING" | "ENDED" | "RESULTS_ANNOUNCED";
  startDate: Date;
  endDate: Date;
  preregStart?: Date | null;
  prizeAmount?: number | null;
  prizeType?: string | null;
  winnerVideoId?: string | null;
  winnerUserId?: string | null;
  entries: ContestEntry[];
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContestEntry {
  id: string;
  contestId: string;
  videoId: string;
  video?: Video;
  userId: string;
  user?: User;
  pointsEarned: number;
  createdAt: Date;
}

export interface ContestVote {
  id: string;
  contestId: string;
  userId: string;
  videoId: string;
  createdAt: Date;
}

// ============= UI Types =============
export interface Pagination<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============= Legacy WordPress Mapping =============
export interface LegacyVideoData {
  id: number;
  title: string;
  description: string;
  slug: string;
  thumbnail: string;
  videoUrl: string;
  viewCount: number;
  duration: string; // "03:48"
  publishDate: string;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  categories: string[];
  tags: string[];
  contest?: string;
  likeCount: number;
  commentCount: number;
}

// ============= API Route Handler Type =============
export type RouteHandler<T = any> = (
  req: NextRequest,
  params?: Record<string, string>
) => Promise<{ status: number; data?: T; error?: string }>;
