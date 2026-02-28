export type UpdateMeetingParticipationRequest = {
  meetingId: number;
  joinRequestId: number;
  status: "APPROVED" | "REJECTED";
};

export type UpdateMeetingParticipationResponse = {
  meetingId: number;
  requestId: number;
  status: "APPROVED" | "REJECTED";
};
