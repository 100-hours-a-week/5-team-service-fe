"use client";

import { Spinner } from "@/components/ui/spinner";

type ChatLobbyWaitingStatusProps = {
  isBootstrapping: boolean;
  errorMessage: string | null;
  totalCapacity: number;
  currentCount: number;
};

export default function ChatLobbyWaitingStatus({
  isBootstrapping,
  errorMessage,
  totalCapacity,
  currentCount,
}: ChatLobbyWaitingStatusProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <div className="flex justify-center">
          <Spinner className="size-10 text-primary-purple animate-spin [animation-duration:1.5s]" />
        </div>
        <p className="mt-4 text-center text-heading text-gray-900">
          {totalCapacity > 0
            ? `${totalCapacity}명 중 ${currentCount}명 대기 중`
            : `${currentCount}명 대기 중`}
        </p>
        <p className="mt-2 text-center text-body-2 !font-[400] text-gray-500">
          방장이 채팅을 시작할 때까지 잠시 기다려주세요.
        </p>
        {!isBootstrapping && errorMessage ? (
          <div className="mt-4 p-4 text-label text-red-500 text-center">{errorMessage}</div>
        ) : null}
      </div>
    </div>
  );
}
