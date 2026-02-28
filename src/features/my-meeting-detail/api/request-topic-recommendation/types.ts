export type RequestTopicRecommendationRequest = {
  meetingId: number;
  roundNo: number;
};

export type RequestTopicRecommendationResponse = {
  meetingId: number;
  roundNo: number;
  topic: string;
  remainingCount: number;
};
