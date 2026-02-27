"use client";

import PageHeader from "@/components/layout/PageHeader";
import type { ChatLobbyInfo } from "../model/types";
import ChatLobbyMemberStatus from "./ChatLobbyMemberStatus";
import ChatLobbyWaitingStatus from "./ChatLobbyWaitingStatus";
import ChatLobbyBottomButon from "./ChatLobbyBottomButon";

type Props = {
  chatLobbyInfo: ChatLobbyInfo | null;
  isBootstrapping: boolean;
  isJoining: boolean;
  isLeaving: boolean;
  isStarting: boolean;
  isHost: boolean;
  errorMessage: string | null;
  progress: number;
  totalCapacity: number;
  currentCount: number;
  onLeave: () => void;
  onStart: () => void;
};

export function ChatLobby({
  chatLobbyInfo,
  isBootstrapping,
  isJoining,
  isLeaving,
  isStarting,
  isHost,
  errorMessage,
  totalCapacity,
  currentCount,
  onLeave,
  onStart,
}: Props) {
  return (
    <div className="flex h-dvh flex-col bg-white">
      <PageHeader title="토론 대기실" showBackButton={false} />

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-6">
        <ChatLobbyMemberStatus
          chatLobbyInfo={chatLobbyInfo}
          isBootstrapping={isBootstrapping}
          isJoining={isJoining}
        />

        <ChatLobbyWaitingStatus
          isBootstrapping={isBootstrapping}
          errorMessage={errorMessage}
          totalCapacity={totalCapacity}
          currentCount={currentCount}
        />

        <ChatLobbyBottomButon
          isHost={isHost}
          isLeaving={isLeaving}
          isStarting={isStarting}
          onLeave={onLeave}
          onStart={onStart}
        />
      </div>
    </div>
  );
}
