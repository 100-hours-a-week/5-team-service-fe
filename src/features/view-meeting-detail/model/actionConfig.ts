import { MeetingParticipationStatus } from "@/features/meeting-participation-status/model/types";
import type { GetMeetingDetailResponse } from "./types";

type ActionTone = "active" | "inactive";

export type MeetingJoinAction = {
  label: string;
  tone: ActionTone;
  disabled: boolean;
};

type MeetingStatus = GetMeetingDetailResponse["meeting"]["status"];
type ParticipationStatus = MeetingParticipationStatus;

const DEFAULT_JOIN_ACTION: MeetingJoinAction = {
  label: "모임 가입하기",
  tone: "active",
  disabled: false,
};

const JOIN_ACTION_BY_PARTICIPATION: Record<ParticipationStatus, MeetingJoinAction> = {
  NONE: DEFAULT_JOIN_ACTION,
  PENDING: { label: "승인 대기중", tone: "inactive", disabled: false },
  APPROVED: { label: "가입 완료", tone: "inactive", disabled: true },
  LEFT: { label: "모임 다시 가입하기", tone: "active", disabled: false },
  REJECTED: { label: "모임 다시 신청하기", tone: "active", disabled: false },
  KICKED: { label: "강제 탈퇴된 모임입니다.", tone: "inactive", disabled: false },
};

const CLOSED_ACTION_BY_MEETING_STATUS: Partial<Record<MeetingStatus, MeetingJoinAction>> = {
  FINISHED: { label: "모집이 마감되었습니다.", tone: "inactive", disabled: true },
  CANCELED: { label: "종료된 모임입니다.", tone: "inactive", disabled: true },
};

export function getMeetingJoinAction({
  meetingStatus,
  participationStatus,
}: {
  meetingStatus?: MeetingStatus;
  participationStatus?: ParticipationStatus | string | null;
}): MeetingJoinAction {
  if (meetingStatus && meetingStatus !== "RECRUITING") {
    return (
      CLOSED_ACTION_BY_MEETING_STATUS[meetingStatus] ?? {
        label: "모집이 마감되었습니다.",
        tone: "inactive",
        disabled: true,
      }
    );
  }

  if (!participationStatus) return DEFAULT_JOIN_ACTION;
  return (
    JOIN_ACTION_BY_PARTICIPATION[participationStatus as ParticipationStatus] ?? DEFAULT_JOIN_ACTION
  );
}
