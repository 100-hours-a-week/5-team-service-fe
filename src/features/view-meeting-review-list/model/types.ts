export type MeetingReviewItem = {
  reviewId: number;
  reviewerProfileImageUrl: string | null;
  meetingTitle: string;
  roundNo: number;
  bookTitle: string;
  meetingRating: number;
  content: string;
  imageUrls: string[];
};

export type MeetingReviewListResponse = {
  items: MeetingReviewItem[];
  pageInfo: {
    nextCursorId: number;
    hasNext: boolean;
    size: number;
  };
};

export type GetMeetingReviewsParams = {
  meetingId: number;
  size?: number;
  cursorId?: number;
};

export type GetMeetingReviewsServerParams = GetMeetingReviewsParams & {
  requestInit?: RequestInit & { timeoutMs?: number };
};

export type MeetingReviewListRestore = {
  anchorY: number;
  createdAt: number;
  loadedCount: number;
  size: number;
};
