"use client";

import PageHeader from "@/components/layout/PageHeader";
import ChatResult from "@/features/chat-result/ui/ChatResult";

export default function ChatResultPage({ roomId }: { roomId: number }) {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white">
      <PageHeader title="투표 및 결과 조회" showBackButton={false} />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <ChatResult roomId={roomId} />
      </div>
    </div>
  );
}
