export type MyReviewItem = {
  reviewId: number;
  meetingTitle: string;
  roundNo: number;
  bookTitle: string;
  meetingRating: number;
  content: string;
  imageUrls: string[];
};

export type MyReviewListResponse = {
  items: MyReviewItem[];
  pageInfo: {
    nextCursorId: number;
    hasNext: boolean;
    size: number;
  };
};

export type GetMyReviewsRequest = {
  size?: number;
  cursorId?: number;
};

export type MyReviewListRestore = {
  anchorY: number;
  clickedIndex: number;
  createdAt: number;
  size: number;
};
