export type ReportStatus =
  | "NOT_YET_WRITABLE"
  | "NOT_SUBMITTED"
  | "DEADLINE_PASSED"
  | "PENDING_REVIEW"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export const memberReportStatusLabel: Record<ReportStatus, string> = {
  NOT_YET_WRITABLE: "미제출",
  NOT_SUBMITTED: "미제출",
  PENDING_REVIEW: "승인 대기",
  DEADLINE_PASSED: "제출 기한 마감",
  SUBMITTED: "제출됨",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
};

export const memberReportStatusClass: Record<ReportStatus, string> = {
  NOT_YET_WRITABLE: "bg-gray-200 text-gray-600",
  NOT_SUBMITTED: "bg-gray-200 text-gray-600",
  PENDING_REVIEW: "bg-gray-200 text-gray-600",
  DEADLINE_PASSED: "bg-gray-200 text-gray-600",
  SUBMITTED: "bg-orange-100 text-orange-600",
  APPROVED: "bg-green-100 text-green-600",
  REJECTED: "bg-red-100 text-red-600",
};

export const reportStatusLabel: Record<ReportStatus, string> = {
  NOT_YET_WRITABLE: "미제출",
  NOT_SUBMITTED: "미제출",
  PENDING_REVIEW: "승인 대기",
  DEADLINE_PASSED: "제출 기한 마감",
  SUBMITTED: "제출됨",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
};

export const reportStatusClass: Record<ReportStatus, string> = {
  NOT_YET_WRITABLE: "bg-gray-200 text-gray-600",
  NOT_SUBMITTED: "bg-gray-200 text-gray-600",
  PENDING_REVIEW: "bg-gray-200 text-gray-600",
  DEADLINE_PASSED: "bg-gray-200 text-gray-600",
  SUBMITTED: "bg-orange-100 text-orange-600",
  APPROVED: "bg-green-100 text-green-600",
  REJECTED: "bg-red-100 text-red-600",
};

export const reportActionLabel: Record<ReportStatus, string> = {
  NOT_YET_WRITABLE: "아직 독후감 제출 기한이 아닙니다.",
  NOT_SUBMITTED: "독후감 제출하기",
  PENDING_REVIEW: "독후감 검증 중",
  DEADLINE_PASSED: "독후감 제출 기한이 지났습니다.",
  SUBMITTED: "독후감 확인하기",
  APPROVED: "독후감 확인하기",
  REJECTED: "독후감 반려 사유 확인하기",
};
