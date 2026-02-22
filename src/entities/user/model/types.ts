export type UserProfile = {
  nickname: string;
  profileImagePath: string;
  profileImageKey: string;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  leaderIntro: string | null;
  memberIntro: string | null;
};
