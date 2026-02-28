import { MeetingRound } from "../types";

export type GetMyMeetingDetailReqeust = {
  meetingId: number;
};

export type GetMyMeetingDetailResponse = {
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
