"use client";

import Image from "next/image";
import type { ReviewCandidateMember } from "../model/types";
import MeetingBestMemberSkeleton from "./MeetingBestMemberSkeleton";

type MeetingBestMemberSelectionProps = {
  members: ReviewCandidateMember[];
  selectedMemberId: number;
  onSelectMember: (memberId: number) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

export default function MeetingBestMemberSelection({
  members,
  selectedMemberId,
  onSelectMember,
  isLoading,
  isError,
  errorMessage,
}: MeetingBestMemberSelectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-gray-900">
        오늘의 베스트 모임원을 선택해 주세요
      </h2>
      <p className="text-xs text-gray-500">토론에 적극적으로 참여한 모임원을 골라주세요.</p>

      {isLoading ? <MeetingBestMemberSkeleton /> : null}

      {isError ? (
        <p className="text-sm text-red-500">베스트 모임원 목록을 불러오지 못했어요.</p>
      ) : null}

      {!isLoading && !isError ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto py-1">
          {members.map((member) => {
            const selected = selectedMemberId === member.userId;
            return (
              <button
                key={member.userId}
                type="button"
                onClick={() => onSelectMember(member.userId)}
                className={`flex w-20 shrink-0 flex-col items-center gap-2 rounded-lg border p-2 ${
                  selected ? "border-primary bg-gray-purple" : "border-transparent"
                }`}
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                  {member.profileImageUrl ? (
                    <Image
                      src={member.profileImageUrl}
                      alt={member.nickname}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <p className="w-full truncate text-center text-caption text-gray-900">
                  {member.nickname}
                </p>
              </button>
            );
          })}
        </div>
      ) : null}

      {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
    </section>
  );
}
