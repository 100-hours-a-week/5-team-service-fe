export const RECOMMEND_ERROR_CODES = [
  "NO_BOOK_REPORTS_FOR_TOPIC",
  "TOPIC_RECOMMENDATION_LIMIT_EXCEEDED",
  "INTERNAL_SERVER_ERROR",
] as const;

export type RecommendErrorCode = (typeof RECOMMEND_ERROR_CODES)[number];

export type TopicItem = { topicNo: number; topic: string };

export type RecommendMeetingTopicProps = {
  meetingId: number;
  roundId: number;
  roundNo: number;
  initialTopics?: TopicItem[];
  editable: boolean;
};
