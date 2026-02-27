import { Member } from "@/entities/chat/model/types";
import { UserRoundCheck, UserRoundX } from "lucide-react";
import Image from "next/image";

type ChatRoomMemebersProps = {
  agreeMembers: Member[];
  disagreeMembers: Member[];
};

export default function ChatRoomMembers({ agreeMembers, disagreeMembers }: ChatRoomMemebersProps) {
  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="flex items-center gap-2 text-body-2 !font-[600] text-gray-900">
            <UserRoundCheck className="w-5 h-5 text-primary" />
            찬성
          </p>
          <div className="mt-2.5 space-y-2.5">
            {agreeMembers.length > 0 ? (
              agreeMembers.map((member, index) => (
                <div
                  key={`guide-agree-${member.nickname}-${index}`}
                  className="flex items-center gap-2"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {member.profileImageUrl ? (
                      <Image
                        src={member.profileImageUrl}
                        alt={member.nickname}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="text-body-2 text-gray-800">{member.nickname}</p>
                </div>
              ))
            ) : (
              <div className="flex h-8 items-center">
                <p className="text-caption text-gray-400">참가자 없음</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="flex items-center gap-2 text-body-2 !font-[600] text-gray-900">
            <UserRoundX className="w-5 h-5 text-primary" />
            반대
          </p>
          <div className="mt-2.5 space-y-2.5">
            {disagreeMembers.length > 0 ? (
              disagreeMembers.map((member, index) => (
                <div
                  key={`guide-disagree-${member.nickname}-${index}`}
                  className="flex items-center gap-2"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {member.profileImageUrl ? (
                      <Image
                        src={member.profileImageUrl}
                        alt={member.nickname}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="text-body-2 text-gray-800">{member.nickname}</p>
                </div>
              ))
            ) : (
              <div className="flex h-8 items-center">
                <p className="text-caption text-gray-400">참가자 없음</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
