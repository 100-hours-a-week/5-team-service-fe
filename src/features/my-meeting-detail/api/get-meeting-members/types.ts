export type GetMeetingMembersRequest = {
  meetingId: number;
};

type JoinedMeetingMember = {
  meetingMemberId: number;
  nickname: string;
  profileImagePath?: string | null;
  joinedAt: string;
};

export type GetMeetingMembersResponse = {
  meetingId: number;
  memberCount: number;
  members: JoinedMeetingMember[];
};
