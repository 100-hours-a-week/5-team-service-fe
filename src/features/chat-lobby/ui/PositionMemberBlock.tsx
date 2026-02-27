"use client";

import type { ChatLobbyInfo } from "../model/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";

type PositionMemberBlockProps = {
  label: "찬성" | "반대";
  members: ChatLobbyInfo["members"];
  slotCount: number;
};

export default function PositionMemberBlock({
  label,
  members,
  slotCount,
}: PositionMemberBlockProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-label !font-[600] text-gray-900">{label}</p>
        <span className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-caption text-gray-700">
          {members.length}/{slotCount}
        </span>
      </div>

      <div className="mt-2 space-y-2">
        {Array.from({ length: slotCount }).map((_, index) => {
          const member = members[index];
          if (!member) {
            return (
              <div
                key={`${label}-empty-${index}`}
                className="flex h-11 items-center rounded-lg border border-dashed border-gray-300 bg-white px-3 text-caption text-gray-400"
              >
                대기 중
              </div>
            );
          }

          const slotKey = `${member.nickname}:${member.role}:${member.position}:${index}`;

          return (
            <div
              key={`${label}-${slotKey}`}
              className="animate-slot-bang flex items-center gap-2 rounded-lg bg-white px-3 py-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={member.profileImageUrl ?? ""}
                  alt={`${member.nickname} 프로필`}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback className="bg-gray-200 text-[10px] text-gray-700">
                  {member.nickname.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <p className="truncate text-caption text-gray-900">
                {member.nickname}
                {member.role === "HOST" ? (
                  <span className="ml-1 !font-[600] text-primary">(방장)</span>
                ) : null}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
