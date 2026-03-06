export type RecommendMeetingTopicRequest = {
  meetingId: number;
  roundNo: number;
};

export type RecommendMeetingTopicResponse = {
  meetingId: number;
  roundNo: number;
  topic: string;
  remainingCount: number;
};
