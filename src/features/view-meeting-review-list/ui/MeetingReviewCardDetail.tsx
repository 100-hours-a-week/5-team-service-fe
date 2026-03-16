"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import ReviewImageViewer from "@/features/view-my-review-detail/ui/ReviewImageViewer";
import type { MeetingReviewItem } from "../model/types";

type MeetingReviewCardDetailProps = {
  review: MeetingReviewItem;
};

export default function MeetingReviewCardDetail({ review }: MeetingReviewCardDetailProps) {
  const rating = Number.isFinite(review.meetingRating) ? review.meetingRating : 0;
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isViewerClosing, setIsViewerClosing] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const viewerCloseTimerRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLParagraphElement | null>(null);

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

  const handleOpenViewer = (index: number) => {
    if (!review.imageUrls.length) return;
    if (viewerCloseTimerRef.current) {
      window.clearTimeout(viewerCloseTimerRef.current);
      viewerCloseTimerRef.current = null;
    }
    setViewerIndex(index);
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
      <article className="border-b border-gray-200 px-3 py-5 first:pt-2">
        <div className="flex items-start gap-4">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
            {review.reviewerProfileImageUrl ? (
              <Image
                src={review.reviewerProfileImageUrl}
                alt={`${review.meetingTitle} 리뷰 작성자 프로필`}
                fill
                sizes="40px"
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
            <div className="mt-1 flex gap-1 text-sm text-gray-500">
              <p>{review.roundNo}회차 | </p>
              <p className="truncate">{review.bookTitle}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-gray-900">
          <StarIcon className="h-4 w-4 text-primary" />
          <span className="text-body-emphasis leading-none">{rating.toFixed(1)}</span>
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

        {review.imageUrls.length ? (
          <div className="mt-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-3">
              {review.imageUrls.map((imageUrl, index) => (
                <button
                  key={`${review.reviewId}-image-${index}`}
                  type="button"
                  onClick={() => handleOpenViewer(index)}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100 border border-1 border-gray-200"
                  aria-label={`후기 이미지 ${index + 1}번 보기`}
                >
                  <Image
                    src={imageUrl}
                    alt={`모임 후기 이미지 ${index + 1}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </article>

      <ReviewImageViewer
        key={isViewerOpen ? `${review.reviewId}-${viewerIndex}` : `closed-${review.reviewId}`}
        isOpen={isViewerOpen && !isViewerClosing}
        isClosing={isViewerClosing}
        imageUrls={review.imageUrls ?? []}
        initialIndex={viewerIndex}
        onClose={handleCloseViewer}
      />
    </>
  );
}
