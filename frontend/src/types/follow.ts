export interface FollowUser {
  _id: string;
  username: string;
  name: string;
  avatar?: string;
  isFollowing: boolean;
  isMutual: boolean;
  cursor: string | null;
}

export interface FollowListResponse {
  follows: FollowUser[];
  nextCursor: string | null;
}

export interface ToggleFollowResponse {
  isFollowing: boolean;
}
