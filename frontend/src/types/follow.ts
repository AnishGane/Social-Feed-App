export interface FollowUser {
  _id: string;
  username: string;
  name: string;
  isFollowing: boolean;
  isMutual: boolean;
}

export interface FollowListResponse {
  follows: FollowUser[];
  nextCursor: string | null;
}

export interface ToggleFollowResponse {
  isFollowing: boolean;
}
