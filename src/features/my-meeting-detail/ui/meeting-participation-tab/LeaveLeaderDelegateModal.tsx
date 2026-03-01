import { Crown } from "lucide-react";
import { JoinedMeetingMember } from "../../api/types";

type LeaveLeaderDelegateModalProps = {
  isOpen: boolean;
  members: JoinedMeetingMember[];
  isDelegating: boolean;
  onClose: () => void;
  onDelegate: (memberId: number) => void;
};

export default function LeaveLeaderDelegateModal({
  isOpen,
  members,
  isDelegating,
  onClose,
  onDelegate,
}: LeaveLeaderDelegateModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[500px] -translate-x-1/2">
        <button
          type="button"
          aria-label="모달 닫기"
          onClick={onClose}
          disabled={!isOpen || isDelegating}
          className={`absolute inset-0 transition-colors duration-200 ${
            isOpen ? "pointer-events-auto bg-black/40" : "pointer-events-none bg-black/0"
          }`}
        />
      </div>
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full max-w-[380px] rounded-2xl bg-white px-5 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-95 opacity-0"
        }`}
      >
        <h2 className="text-center text-body-1 !font-[600] text-gray-900">
          모임장 권한을 위임해 주세요
        </h2>
        <p className="mt-2 text-center text-label text-gray-500">
          탈퇴 전, 다음 모임장을 선택해야 합니다.
        </p>
        <div className="no-scrollbar mt-5 max-h-[260px] space-y-2 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.meetingMemberId}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                  {member.profileImagePath ? (
                    <img
                      src={member.profileImagePath}
                      alt={member.nickname}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <p className="truncate text-sm !font-[600] text-gray-900">{member.nickname}</p>
              </div>
              <button
                type="button"
                onClick={() => onDelegate(member.meetingMemberId)}
                disabled={isDelegating}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-700 disabled:opacity-50"
                aria-label={`${member.nickname}에게 모임장 위임`}
              >
                <Crown className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
