export type MeetingItem = {
  meetingId: number;
  meetingImagePath: string;
  isBookmarked?: boolean;
  isRecruiting?: boolean;
  title: string;
  readingGenreId: number;
  leaderNickname: string;
  capacity: number;
  currentMemberCount: number;
  remainingDays: number;
};

export type MeetingListResponse = {
  items: MeetingItem[];
  pageInfo: {
    nextCursorId: number;
    hasNext: boolean;
    size: number;
  };
};
