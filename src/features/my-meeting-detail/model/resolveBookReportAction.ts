import type { MeetingRound } from "../api/types";
import type { ReportStatus } from "./types";

type bookReportActionType = "WRITE" | "VIEW" | "NONE";

export type ResolvedBookReportAction = {
  status: ReportStatus;
  action: bookReportActionType;
  disabled: boolean;
  label: string;
};

const reportActionLabel: Record<ReportStatus, string> = {
  NOT_YET_WRITABLE: "아직 독후감 제출 기한이 아닙니다.",
  NOT_SUBMITTED: "독후감 제출하기",
  PENDING_REVIEW: "독후감 검증 중",
  DEADLINE_PASSED: "독후감 제출 기한이 지났습니다.",
  SUBMITTED: "독후감 확인하기",
  APPROVED: "독후감 확인하기",
  REJECTED: "독후감 반려 사유 확인하기",
};

function normalizeReportStatus(round: MeetingRound): ReportStatus {
  const rawStatus = round.bookReport.status ?? "NOT_SUBMITTED";

  if (rawStatus in reportActionLabel) {
    return rawStatus as ReportStatus;
  }

  return "NOT_SUBMITTED";
}

export default function resolveBookReportAction(round: MeetingRound): ResolvedBookReportAction {
  const status = normalizeReportStatus(round);
  const reportId = round.bookReport.id ?? null;

  if (status === "NOT_SUBMITTED" || status === "REJECTED") {
    return {
      status,
      action: "WRITE",
      disabled: false,
      label: reportActionLabel[status],
    };
  }

  if (
    reportId &&
    (status === "PENDING_REVIEW" || status === "SUBMITTED" || status === "APPROVED")
  ) {
    return {
      status,
      action: "VIEW",
      disabled: false,
      label: reportActionLabel[status],
    };
  }

  return {
    status,
    action: "NONE",
    disabled: true,
    label: reportActionLabel[status],
  };
}
