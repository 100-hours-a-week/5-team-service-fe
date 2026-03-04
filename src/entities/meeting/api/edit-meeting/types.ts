export type EditMeetingRequest = {
  meetingImagePath?: string;
  title?: string;
  description?: string;
  readingGenreId?: number;
  capacity?: number;
  leaderIntro?: string;
  leaderIntroSavePolicy?: boolean;
  recruitmentDeadline?: string;
};

export type EditMeetingResponse = {
  meetingId: number;
};
