export type BookReportStatus =
  | "NOT_YET_WRITABLE"
  | "NOT_SUBMITTED"
  | "DEADLINE_PASSED"
  | "PENDING_REVIEW"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type BookReportSubmitStatus = "IN_PROGRESS" | "NOT_YET" | "DEADLINE_PASSED";

export type MeetingReviewStatus =
  | "NOT_YET_WRITABLE"
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "DEADLINE_PASSED";

export type MeetingRound = {
  roundId: number;
  roundNo: number;
  meetingDate: string;
  dday: number;
  meetingLink: string | null;
  canJoinMeeting: boolean;
  book: {
    title: string;
    authors: string;
    publisher: string;
    thumbnailUrl: string;
    publishedAt: string;
  };
  bookReport: {
    status: null | "SUBMITTED" | "APPROVED" | "REJECTED";
    id: number | null;
  };
  review?: {
    status: MeetingReviewStatus;
    id: number | null;
  };
  topics?: { topicNo: number; topic: string }[];
};

export type RoundBookReportMember = {
  meetingMemberId: number;
  nickname: string;
  bookReport: {
    id?: number | null;
    bookReportId?: number | null;
    status: BookReportStatus;
    submittedAt: string | null;
  } | null;
  submissionRate: number;
};

export type RoundBookReportListResponse = {
  roundNo: number;
  submittedCount: number;
  totalCount: number;
  members: RoundBookReportMember[];
};

export type RoundBookReportDetailResponse = {
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
    status: BookReportStatus;
    content: string;
    rejectionReason: string | null;
  };
};

export type JoinedMeetingMember = {
  meetingMemberId: number;
  nickname: string;
  profileImagePath?: string | null;
  joinedAt: string;
};

export type JoinedMeetingMembersResponse = {
  meetingId: number;
  memberCount: number;
  members: JoinedMeetingMember[];
};

export type PendingParticipationItem = {
  joinRequestId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  nickname: string;
  memberIntro: string;
  profileImagePath?: string | null;
};

export type PendingParticipationsResponse = {
  meetingId: number;
  items: PendingParticipationItem[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};

export type MeetingParticipantItem = {
  meetingMemberId: number;
  nickname: string;
  memberIntro: string;
  profileImagePath?: string | null;
};

export type MeetingParticipantsResponse = {
  members: MeetingParticipantItem[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};
