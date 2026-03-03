"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import WarningConfirmModal from "@/components/common/WarningConfirmModal";
import { CreateChatFormSteps } from "@/features/create-chat/model/types";
import CreateChatFormProvider from "@/features/create-chat/ui/CreateChatFormProvider";
import { useAuthStore } from "@/shared/store/authStore";

export default function CreateChatPage({ step }: CreateChatFormSteps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const initialized = useAuthStore((state) => state.initialized);
  const isLoginRequiredOpen = initialized && !accessToken;

  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <PageHeader title="채팅 토론방 생성" />
      <CreateChatFormProvider step={step} />
      <WarningConfirmModal
        isOpen={isLoginRequiredOpen}
        isClosing={false}
        title="로그인이 필요해요!"
        description="채팅 토론방을 생성하려면 로그인해주세요."
        confirmLabel="로그인하기"
        cancelLabel="취소"
        onClose={() => router.back()}
        onConfirm={() => router.push("/oauth")}
      />
    </div>
  );
}
