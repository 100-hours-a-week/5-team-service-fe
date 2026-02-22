import { UserProfile } from "../../model/types";

export type EditUserProfileRequest = {
  nickname: string;
  profileImagePath: string;
  leaderIntro?: string;
  memberIntro?: string;
};

export type EditUserProfileResponse = UserProfile;
