export type MyReviewMember = {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
};

export type MyReviewDetailResponse = {
  reviewId: number;
  meetingTitle: string;
  roundNo: number;
  bookTitle: string;
  meetingRating: number;
  leaderRating?: number;
  content: string;
  imageUrls: string[];
  bestMemberId?: number | null;
  members?: MyReviewMember[];
};
