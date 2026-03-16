import Link from "next/link";
import type { MeetingReviewListResponse } from "../model/types";
import MeetingReviewCard from "./MeetingReviewCard";

type MeetingReviewsPreviewSectionProps = {
  meetingId: number;
  reviewResponse: MeetingReviewListResponse;
};

export default function MeetingReviewsPreviewSection({
  meetingId,
  reviewResponse,
}: MeetingReviewsPreviewSectionProps) {
  const previewItems = reviewResponse.items.slice(0, 3);
  const showMoreButton = reviewResponse.items.length > 0;

  return (
    <section className="mt-10 space-y-4 border-t-2 border-gray-100 pt-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] !font-[600] text-gray-900">모임장 후기</h3>
      </div>

      {previewItems.length ? (
        <div>
          {previewItems.map((review) => (
            <MeetingReviewCard key={review.reviewId} review={review} showDivider={false} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 px-4 py-5 text-sm text-gray-500">
          아직 등록된 후기가 없어요.
        </div>
      )}

      {showMoreButton ? (
        <Link
          href={`/meeting/detail/${meetingId}/reviews`}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-white text-label !font-[600] font-semibold text-primary border border-1 border-primary"
        >
          후기 전체 보기
        </Link>
      ) : null}
    </section>
  );
}
