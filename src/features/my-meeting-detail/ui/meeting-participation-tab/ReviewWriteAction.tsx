import type { MeetingRound } from "../../api/types";
import resolveReviewAction from "../../model/resolveReviewAction";

type ReviewWriteActionProps = {
  round: MeetingRound;
  onOpenReview: () => void;
};

export default function ReviewWriteAction({ round, onOpenReview }: ReviewWriteActionProps) {
  const reviewAction = resolveReviewAction(round);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900">후기 작성하기</h2>
      </div>

      <p className="text-xs text-gray-500">모임 종료 후 24시간 동안 후기를 작성할 수 있습니다.</p>

      <button
        type="button"
        onClick={onOpenReview}
        disabled={reviewAction.disabled}
        className={`h-12 w-full rounded-xl text-sm font-semibold text-primary border border-1 border-primary ${
          reviewAction.disabled ? "cursor-not-allowed text-primary/80" : "text-primary"
        }`}
      >
        {reviewAction.label}
      </button>
    </section>
  );
}
