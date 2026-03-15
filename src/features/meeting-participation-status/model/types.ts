export type MeetingParticipationStatus =
  | "NONE"
  | "PENDING"
  | "APPROVED"
  | "LEFT"
  | "REJECTED"
  | "KICKED";

export type GetMeetingParticipationStatusResponse = {
  totalCount: number;
  profileImages: string[];
  myParticipationStatus: MeetingParticipationStatus;
};
