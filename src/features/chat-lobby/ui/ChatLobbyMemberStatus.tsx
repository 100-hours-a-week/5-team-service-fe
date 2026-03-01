"use client";

import type { ChatLobbyInfo } from "../model/types";
import PositionMemberBlock from "./PositionMemberBlock";

type ChatLobbyMemberStatusProps = {
  chatLobbyInfo: ChatLobbyInfo | null;
  isBootstrapping: boolean;
  isJoining: boolean;
};

export default function ChatLobbyMemberStatus({
  chatLobbyInfo,
  isBootstrapping,
  isJoining,
}: ChatLobbyMemberStatusProps) {
  if (isBootstrapping || isJoining) {
    return null;
  }

  if (!chatLobbyInfo) {
    return null;
  }

  const members = Array.isArray(chatLobbyInfo.members) ? chatLobbyInfo.members : [];
  const agreeMembers = members.filter((member) => member.position === "AGREE");
  const disagreeMembers = members.filter((member) => member.position === "DISAGREE");
  const slotCount = Math.max(chatLobbyInfo.maxPerPosition, 1);

  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between text-sm">
        <p className="font-semibold text-gray-900">참여자</p>
        <p className="text-gray-600">
          찬성 {chatLobbyInfo.agreeCount} · 반대 {chatLobbyInfo.disagreeCount}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <PositionMemberBlock label="찬성" members={agreeMembers} slotCount={slotCount} />
        <PositionMemberBlock label="반대" members={disagreeMembers} slotCount={slotCount} />
      </div>
    </div>
  );
}
