"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import FullScreenSpinner from "@/shared/ui/FullScreenSpinner";
import getMyReviewDetail from "../api/getMyReviewDetail";
import deleteMyReview from "../api/deleteMyReview";
import ReviewImageViewer from "./ReviewImageViewer";

function ReadOnlyRatingSection({
  title,
  description,
  rating,
}: {
  title: string;
  description: string;
  rating: number;
}) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="text-xs text-gray-500">{description}</p>
      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) =>
          index < filled ? (
            <StarIconSolid key={`${title}-star-${index}`} className="h-7 w-7 text-primary" />
          ) : (
            <StarIconOutline key={`${title}-star-${index}`} className="h-7 w-7 text-gray-300" />
          ),
        )}
      </div>
    </section>
  );
}

export default function MyReviewDetail({ reviewId }: { reviewId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [isViewerClosing, setIsViewerClosing] = useState(false);
  const viewerCloseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (viewerCloseTimerRef.current) {
        window.clearTimeout(viewerCloseTimerRef.current);
      }
    };
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myReviewDetail", reviewId],
    queryFn: () => getMyReviewDetail({ reviewId }),
    enabled: Number.isFinite(reviewId) && reviewId > 0,
    retry: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMyReview({ reviewId }),
    onSuccess: async () => {
      sessionStorage.setItem("myReviewList:forceRefetch", "1");
      await queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      router.replace("/my/reviews");
    },
  });

  if (!Number.isFinite(reviewId) || reviewId <= 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-500">
        유효하지 않은 후기입니다.
      </div>
    );
  }

  if (isLoading) {
    return <FullScreenSpinner transparent />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-500">
        후기 상세 정보를 불러오지 못했어요.
      </div>
    );
  }

  const leaderRating = data.leaderRating ?? data.meetingRating;
  const selectedBestMemberId = data.bestMemberId ?? 0;
  const members = data.members?.length ? data.members : [];
  const handleOpenViewer = (index: number) => {
    if (viewerCloseTimerRef.current) {
      window.clearTimeout(viewerCloseTimerRef.current);
      viewerCloseTimerRef.current = null;
    }
    setIsViewerClosing(false);
    setViewerIndex(index);
  };
  const handleCloseViewer = () => {
    if (viewerIndex === null || isViewerClosing) return;
    setIsViewerClosing(true);
    viewerCloseTimerRef.current = window.setTimeout(() => {
      setViewerIndex(null);
      setIsViewerClosing(false);
      viewerCloseTimerRef.current = null;
    }, 200);
  };

  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6">
        <div className="space-y-8">
          <section className="rounded-3xl border border-gray-200 bg-gray-purple px-5 py-5">
            <h1 className="text-[18px] !font-[600] leading-[1.3] text-primary">
              {data.meetingTitle}
            </h1>
            <p className="mt-2 text-label font-semibold text-gray-500">
              {data.roundNo}회차 <span className="mx-2 text-gray-300">|</span> {data.bookTitle}
            </p>
          </section>

          <ReadOnlyRatingSection
            title="오늘 모임은 어떠셨나요?"
            description="별점과 한 줄 후기를 남겨주세요."
            rating={data.meetingRating}
          />

          <ReadOnlyRatingSection
            title="모임장 진행은 어떠셨나요?"
            description="진행 방식, 분위기, 소통 등을 평가해 주세요."
            rating={leaderRating}
          />

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              오늘의 베스트 모임원을 선택해 주세요
            </h2>
            <p className="text-xs text-gray-500">토론에 적극적으로 참여한 모임원을 골라주세요.</p>

            <div className="no-scrollbar flex gap-3 overflow-x-auto py-1">
              {members.map((member) => {
                const selected = selectedBestMemberId === member.userId;
                return (
                  <div
                    key={member.userId}
                    className={`flex w-20 shrink-0 flex-col items-center gap-2 rounded-lg border p-2 ${
                      selected ? "border-primary bg-gray-purple" : "border-transparent"
                    }`}
                  >
                    <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                      {member.profileImageUrl ? (
                        <Image
                          src={member.profileImageUrl}
                          alt={member.nickname}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="w-full truncate text-center text-caption text-gray-900">
                      {member.nickname}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900">모임 후기</h2>
            <div className="min-h-[180px] rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900">
              {data.content}
            </div>
          </section>

          {data.imageUrls?.length ? (
            <section className="space-y-3">
              <h2 className="text-base font-semibold text-gray-900">첨부 사진</h2>
              <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
                {data.imageUrls.map((imageUrl, index) => (
                  <button
                    type="button"
                    key={`${imageUrl}-${index}`}
                    onClick={() => handleOpenViewer(index)}
                    className="relative h-[124px] w-[124px] shrink-0 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100"
                  >
                    <Image
                      src={imageUrl}
                      alt={`리뷰 이미지 ${index + 1}`}
                      fill
                      sizes="124px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="h-12 w-full rounded-xl border border-primary bg-white text-sm font-semibold text-primary disabled:border-gray-300 disabled:text-gray-300"
        >
          {deleteMutation.isPending ? "후기 삭제 중..." : "후기 삭제"}
        </button>
      </div>

      <ReviewImageViewer
        key={viewerIndex ?? -1}
        isOpen={viewerIndex !== null && !isViewerClosing}
        isClosing={isViewerClosing}
        imageUrls={data.imageUrls ?? []}
        initialIndex={viewerIndex ?? 0}
        onClose={handleCloseViewer}
      />
    </>
  );
}
