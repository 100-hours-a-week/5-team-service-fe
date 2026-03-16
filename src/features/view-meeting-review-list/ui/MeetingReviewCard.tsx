"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import ReviewImageViewer from "@/features/view-my-review-detail/ui/ReviewImageViewer";
import type { MeetingReviewItem } from "../model/types";

type MeetingReviewCardProps = {
  review: MeetingReviewItem;
  showDivider?: boolean;
};

export default function MeetingReviewCard({ review, showDivider = true }: MeetingReviewCardProps) {
  const rating = Number.isFinite(review.meetingRating) ? review.meetingRating : 0;
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isViewerClosing, setIsViewerClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const [coverImageSize, setCoverImageSize] = useState<number | null>(null);
  const viewerCloseTimerRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const topRowRef = useRef<HTMLDivElement | null>(null);
  const coverImageUrl = review.imageUrls?.[0] ?? null;
  const extraImageCount = Math.max(0, review.imageUrls.length - 1);

  useEffect(() => {
    return () => {
      if (viewerCloseTimerRef.current) {
        window.clearTimeout(viewerCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const measureOverflow = () => {
      setCanExpand(content.scrollHeight - content.clientHeight > 1);
    };

    measureOverflow();

    const resizeObserver = new ResizeObserver(measureOverflow);
    resizeObserver.observe(content);
    return () => {
      resizeObserver.disconnect();
    };
  }, [review.content]);

  useEffect(() => {
    const topRow = topRowRef.current;
    if (!topRow) return;

    const updateCoverImageSize = () => {
      const nextSize = Math.round(topRow.getBoundingClientRect().height);
      setCoverImageSize((prev) => (prev === nextSize ? prev : nextSize));
    };

    updateCoverImageSize();

    const resizeObserver = new ResizeObserver(updateCoverImageSize);
    resizeObserver.observe(topRow);
    return () => {
      resizeObserver.disconnect();
    };
  }, [review.reviewId]);

  const handleOpenViewer = () => {
    if (!review.imageUrls?.length) return;
    if (viewerCloseTimerRef.current) {
      window.clearTimeout(viewerCloseTimerRef.current);
      viewerCloseTimerRef.current = null;
    }
    setIsViewerClosing(false);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    if (!isViewerOpen || isViewerClosing) return;
    setIsViewerClosing(true);
    viewerCloseTimerRef.current = window.setTimeout(() => {
      setIsViewerOpen(false);
      setIsViewerClosing(false);
      viewerCloseTimerRef.current = null;
    }, 200);
  };

  return (
    <>
      <article className={`${showDivider ? "border-b border-gray-200" : ""} py-5 px-3 first:pt-2`}>
        <div ref={topRowRef} className="flex items-stretch gap-7">
          <div className="min-w-0 flex flex-1 flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
                {review.reviewerProfileImageUrl ? (
                  <Image
                    src={review.reviewerProfileImageUrl}
                    alt={`${review.meetingTitle} 리뷰 작성자 프로필`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserCircleIcon className="h-9 w-9 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-label !font-[600] leading-tight text-primary">
                  {review.meetingTitle}
                  <span className="!font-[500] text-gray-900"> 참여</span>
                </p>
                <div className="flex gap-1">
                  <p className="mt-1 text-sm text-gray-500">{review.roundNo}회차 | </p>
                  <p className="mt-1 truncate text-sm text-gray-500">{review.bookTitle}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-900">
              <StarIcon className="h-4 w-4 text-primary" />
              <span className="text-body-emphasis leading-none">{rating.toFixed(1)}</span>
            </div>
          </div>

          {coverImageUrl ? (
            <button
              type="button"
              onClick={handleOpenViewer}
              className="relative shrink-0 overflow-hidden rounded-2xl bg-gray-100"
              aria-label={`후기 이미지 ${review.imageUrls.length}장 보기`}
              style={
                coverImageSize
                  ? {
                      width: `${coverImageSize}px`,
                      height: `${coverImageSize}px`,
                    }
                  : undefined
              }
            >
              <Image
                src={coverImageUrl}
                alt="모임 후기 대표 이미지"
                fill
                sizes="144px"
                className="object-cover"
              />

              {extraImageCount > 0 ? (
                <div className="absolute right-2 top-2 rounded-full bg-black/65 px-2 py-1 text-caption text-white">
                  +{extraImageCount}
                </div>
              ) : null}
            </button>
          ) : null}
        </div>

        <div className="relative mt-3">
          <p
            ref={contentRef}
            className={`whitespace-pre-line text-sm leading-6 text-gray-700 ${
              !isExpanded ? "line-clamp-2 pr-10" : ""
            }`}
          >
            {review.content}
          </p>

          {!isExpanded && canExpand ? (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="absolute bottom-0 right-0 bg-white pl-2 text-sm leading-6 text-gray-400"
            >
              + 더보기
            </button>
          ) : null}
        </div>

        {isExpanded && canExpand ? (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="mt-1 text-sm font-semibold text-gray-500"
          >
            접기
          </button>
        ) : null}
      </article>

      <ReviewImageViewer
        key={isViewerOpen ? review.reviewId : `closed-${review.reviewId}`}
        isOpen={isViewerOpen && !isViewerClosing}
        isClosing={isViewerClosing}
        imageUrls={review.imageUrls ?? []}
        initialIndex={0}
        onClose={handleCloseViewer}
      />
    </>
  );
}
