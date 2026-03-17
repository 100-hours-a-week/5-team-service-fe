"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import MyReviewDetail from "@/features/view-my-review-detail/ui/MyReviewDetail";

export default function ViewMyReviewDetailPage({ reviewId }: { reviewId: number }) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/my/reviews");
  };

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="나의 후기 상세 보기" onBack={handleBack} />
      </div>
      <MyReviewDetail reviewId={reviewId} />
    </div>
  );
}
