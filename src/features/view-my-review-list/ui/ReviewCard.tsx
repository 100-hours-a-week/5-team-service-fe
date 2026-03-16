"use client";

import Link from "next/link";
import Image from "next/image";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import type { MyReviewItem } from "../model/types";

type ReviewCardProps = {
  review: MyReviewItem;
  onClick?: () => void;
};

export default function ReviewCard({ review, onClick }: ReviewCardProps) {
  const rating = Number.isFinite(review.meetingRating) ? review.meetingRating : 0;
  const filledStars = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <Link
      href={`/my/reviews/${review.reviewId}`}
      onClick={onClick}
      className="block border-b border-gray-200 py-5 first:pt-2"
    >
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-gray-900">{review.meetingTitle}</p>
        <div className="flex gap-2">
          <p className="text-sm text-gray-500">{review.roundNo}회차 | </p>
          <p className="truncate text-sm text-gray-500">{review.bookTitle}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-primary">
        <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
        <div className="ml-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIconSolid
              key={`${review.reviewId}-star-${index}`}
              className={`h-3.5 w-3.5 ${index < filledStars ? "text-primary" : "text-gray-200"}`}
            />
          ))}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{review.content}</p>

      {review.imageUrls?.length ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {review.imageUrls.map((imageUrl, index) => (
            <div
              key={`${review.reviewId}-image-${index}`}
              className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100"
            >
              <Image
                src={imageUrl}
                alt={`리뷰 이미지 ${index + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
