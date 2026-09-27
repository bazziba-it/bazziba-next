export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  role?: "USER" | "ADMIN" | "MODERATOR";
  videoCount?: number;
  followerCount?: number;
  followingCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  videoCount?: number;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: number;
  viewCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  status: "DRAFT" | "PUBLISHED" | "PRIVATE" | "DELETED";
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
  authorId: string;
  author?: User;
  category?: Category;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  user?: User;
  content: string;
  likes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Contest {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  prizePool: number;
  status: "DRAFT" | "ACTIVE" | "ENDED";
  entries?: ContestEntry[];
}

export interface ContestEntry {
  id: string;
  voteCount: number;
  video: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    viewCount: number;
    duration: number;
    createdAt: string;
    author: { id: string; username: string; name: string; image: string };
  };
}
