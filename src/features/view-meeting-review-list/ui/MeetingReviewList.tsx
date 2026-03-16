"use client";

import type { InfiniteData } from "@tanstack/react-query";
import useMeetingReviews from "../model/useMeetingReviews";
import type { MeetingReviewListResponse } from "../model/types";
import MeetingReviewCardDetail from "./MeetingReviewCardDetail";
import MeetingReviewCardDetailSkeleton from "./MeetingReviewCardDetailSkeleton";

type MeetingReviewListProps = {
  meetingId: number;
  initialData?: InfiniteData<MeetingReviewListResponse, number | undefined>;
};

export default function MeetingReviewList({ meetingId, initialData }: MeetingReviewListProps) {
  const { reviews, isError, sentinelRef, showInitSkeleton, showNextSkeleton } = useMeetingReviews({
    meetingId,
    initialData,
  });

  return (
    <div className="px-6 pb-8 pt-5">
      {isError ? (
        <div className="py-10 text-center text-sm text-gray-400">
          모임 후기를 불러오지 못했어요.
        </div>
      ) : null}

      {!isError && !showInitSkeleton && reviews.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400">아직 등록된 후기가 없어요.</div>
      ) : null}

      {showInitSkeleton
        ? Array.from({ length: 4 }).map((_, index) => (
            <MeetingReviewCardDetailSkeleton key={`meeting-review-init-${index}`} />
          ))
        : null}

      {reviews.map((review) => (
        <MeetingReviewCardDetail key={review.reviewId} review={review} />
      ))}

      {showNextSkeleton
        ? Array.from({ length: 2 }).map((_, index) => (
            <MeetingReviewCardDetailSkeleton key={`meeting-review-next-${index}`} />
          ))
        : null}

      <div ref={sentinelRef} />
    </div>
  );
}
