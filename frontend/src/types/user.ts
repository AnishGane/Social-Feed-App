export interface SocialLinks {
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export type User = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;

  name?: string;
  bio?: string;
  bannerImage?: string;

  socialLinks?: SocialLinks;

  createdAt: string;
  updatedAt: string;
};

export interface ProfileStats {
  postsCount: number;
  upvotesReceived: number;
  downvotesReceived: number;
  totalScore: number;
}

export interface ProfileResponse {
  user: User;
  stats: ProfileStats;
}
