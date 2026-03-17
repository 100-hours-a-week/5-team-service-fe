import type { MeetingReviewStatus, MeetingRound } from "../api/types";

type ReviewActionType = "WRITE" | "VIEW" | "NONE";

export type ResolvedReviewAction = {
  action: ReviewActionType;
  disabled: boolean;
  label: string;
};

const reviewActionLabel: Record<MeetingReviewStatus, string> = {
  NOT_YET_WRITABLE: "현재는 후기 작성 시간이 아닙니다.",
  NOT_SUBMITTED: "후기 작성하기",
  SUBMITTED: "후기 확인하기",
  DEADLINE_PASSED: "후기 작성 가능 시간이 지났습니다.",
};

export default function resolveReviewAction(round: MeetingRound): ResolvedReviewAction {
  const reviewStatus = round.review?.status ?? "NOT_SUBMITTED";
  const reviewId = round.review?.id ?? null;

  if (reviewId && (reviewStatus === "SUBMITTED" || reviewStatus === "DEADLINE_PASSED")) {
    return {
      action: "VIEW",
      disabled: false,
      label: "후기 확인하기",
    };
  }

  if (reviewStatus === "NOT_SUBMITTED") {
    return {
      action: "WRITE",
      disabled: false,
      label: reviewActionLabel[reviewStatus],
    };
  }

  return {
    action: "NONE",
    disabled: true,
    label: reviewActionLabel[reviewStatus],
  };
}
