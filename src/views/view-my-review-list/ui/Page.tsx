"use client";

import { useRouter } from "next/navigation";
import Modal from "@/shared/ui/Modal";
import { useAuthStore } from "@/shared/store/authStore";
import PageHeader from "@/components/layout/PageHeader";
import MyReviewList from "@/features/view-my-review-list/ui/MyReviewList";

export default function ViewMyReviewListPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const initialized = useAuthStore((state) => state.initialized);

  if (initialized && !accessToken) {
    return (
      <Modal
        isOpen
        isClosing={false}
        title="로그인이 필요해요!"
        description="로그인 후 내가 쓴 후기 기능을 이용할 수 있어요."
        confirmLabel="로그인하기"
        cancelLabel="홈으로"
        onConfirm={() => router.push("/oauth")}
        onClose={() => router.push("/")}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <PageHeader title="내가 쓴 후기" onBack={() => router.push("/my")} />
      </div>
      <div className="flex-1">
        <MyReviewList />
      </div>
    </div>
  );
}
