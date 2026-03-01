export type GetMemberBookReportRequest = {
  roundId: number;
  bookReportId: number;
};

export type GetMemberBookReportResponse = {
  book: {
    title: string;
    authors: string;
    publisher: string;
    thumbnailUrl: string;
    publishedAt: string;
  };
  writer: {
    meetingMemberId: number;
    nickname: string;
  };
  bookReport: {
    id: number;
    status:
      | "NOT_YET_WRITABLE"
      | "NOT_SUBMITTED"
      | "DEADLINE_PASSED"
      | "PENDING_REVIEW"
      | "SUBMITTED"
      | "APPROVED"
      | "REJECTED";
    content: string;
    rejectionReason: string | null;
  };
};
