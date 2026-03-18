"use client";

import useMyReviews from "../model/useMyReviews";
import ReviewCard from "./ReviewCard";
import ReviewCardSkeleton from "./ReviewCardSkeleton";

export default function MyReviewList() {
  const { reviews, isError, sentinelRef, onClickReview, showInitSkeleton, showNextSkeleton } =
    useMyReviews();

  return (
    <div className="px-6 pb-8 pt-2">
      {isError ? (
        <div className="py-10 text-center text-sm text-gray-400">
          내가 쓴 후기를 불러오지 못했어요.
        </div>
      ) : null}

      {!isError && !showInitSkeleton && reviews.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400">아직 작성한 후기가 없어요!</div>
      ) : null}

      {showInitSkeleton
        ? Array.from({ length: 4 }).map((_, i) => <ReviewCardSkeleton key={`review-init-${i}`} />)
        : null}

      {reviews.map((review, index) => (
        <ReviewCard key={review.reviewId} review={review} onClick={() => onClickReview(index)} />
      ))}

      {showNextSkeleton
        ? Array.from({ length: 2 }).map((_, i) => <ReviewCardSkeleton key={`review-next-${i}`} />)
        : null}

      <div ref={sentinelRef} />
    </div>
  );
}
