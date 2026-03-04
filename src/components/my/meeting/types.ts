export type MyMeetingItem = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  readingGenreId: number | string;
  leaderNickname: string;
  currentRound: number;
  meetingDate: string;
};

export type MyMeetingListResponse = {
  items: MyMeetingItem[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};

export const STATUS_TABS = [
  { label: "진행중", value: "ACTIVE" },
  { label: "승인 대기", value: "PENDING_APPROVAL" },
  { label: "종료", value: "INACTIVE" },
] as const;

export type StatusValue = (typeof STATUS_TABS)[number]["value"];

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
    writableUntil: string | null;
  };
  topics?: { topicNo: number; topic: string }[];
  myProgressPercent?: number;
  membersProgress?: { meetingMemberId: number; nickname: string; progressPercent: number }[];
  bestMeetingMember?: {
    nickname: string;
    tierImagePath: string;
    profileImagePath: string;
  };
  review?: { status: string; id: number | null; writableUntil: string | null };
};

export type BookReportStatus =
  | "NOT_YET_WRITABLE"
  | "NOT_SUBMITTED"
  | "DEADLINE_PASSED"
  | "PENDING_REVIEW"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type RoundBookReportMember = {
  meetingMemberId: number;
  nickname: string;
  bookReport: {
    id?: number | null;
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
  tierImagePath?: string;
  profileImagePath?: string;
  joinedAt: string;
  categories?: {
    readingVolume?: string;
    age?: string;
    gender?: string;
    purpose?: string;
  };
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
  applicant: {
    meetingMemberId: number;
    nickname: string;
    tierImagePath?: string;
    memberIntro?: string;
    profileImagePath?: string;
  };
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

export type MyMeetingDetailResponse = {
  meetingId: number;
  meetingImagePath: string;
  title: string;
  readingGenreName: string;
  leaderInfo: {
    profileImagePath: string;
    nickname: string;
  };
  myRole: "LEADER" | "MEMBER";
  roundCount: number;
  capacity: number;
  currentMemberCount: number;
  rounds: MeetingRound[];
  currentRoundNo: number;
};
