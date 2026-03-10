export type MeetingItem = {
  meetingId: number;
  meetingImagePath: string;
  isBookmarked?: boolean;
  title: string;
  readingGenreId: number;
  leaderNickname: string;
  capacity: number;
  currentMemberCount: number;
  remainingDays: number;
};
