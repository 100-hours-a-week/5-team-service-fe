export type DelegateMeetingLeaderRequest = {
  meetingId: number;
  newLeaderMeetingMemberId: number;
};

export type DelegateMeetingLeaderResponse = {
  newLeaderMeetingMemberId: number;
};
