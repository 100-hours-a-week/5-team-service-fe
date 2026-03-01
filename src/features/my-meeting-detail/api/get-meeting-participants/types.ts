export type GetMeetingParticipantsRequest = {
  meetingId: number;
  cursorId?: number;
  size?: number;
};

type MeetingParticipantItem = {
  meetingMemberId: number;
  nickname: string;
  memberIntro: string;
  profileImagePath?: string | null;
};

export type GetMeetingParticipantsResponse = {
  members: MeetingParticipantItem[];
  pageInfo: {
    nextCursorId: number | null;
    hasNext: boolean;
    size: number;
  };
};
