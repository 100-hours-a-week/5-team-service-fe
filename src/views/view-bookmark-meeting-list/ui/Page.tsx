"use client";

import MainHeader from "@/components/layout/MainHeader";
import { BookmarkedMeetingList } from "@/features/view-bookmarked-meeting-list/ui/BookmarkedMeetingList";
import Modal from "@/shared/ui/Modal";
import { useAuthStore } from "@/shared/store/authStore";
import { useRouter } from "next/navigation";

export default function ViewBookmarkMeetingListPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const initialized = useAuthStore((state) => state.initialized);

  if (initialized && !accessToken) {
    return (
      <Modal
        isOpen
        isClosing={false}
        title="로그인이 필요해요!"
        description="로그인 후 관심 모임 기능을 이용할 수 있어요."
        confirmLabel="로그인하기"
        cancelLabel="홈으로"
        onConfirm={() => router.push("/oauth")}
        onClose={() => router.push("/")}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-20 bg-white">
        <MainHeader hasUnread />
      </div>
      <div className="flex-1">
        <BookmarkedMeetingList />
      </div>
    </div>
  );
}
