"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import MyReviewDetail from "@/features/view-my-review-detail/ui/MyReviewDetail";

export default function ViewMyReviewDetailPage({ reviewId }: { reviewId: number }) {
  const router = useRouter();

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="나의 후기 상세 보기" onBack={() => router.push("/my/reviews")} />
      </div>
      <MyReviewDetail reviewId={reviewId} />
    </div>
  );
}
