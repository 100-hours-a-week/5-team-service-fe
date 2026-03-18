import { useState } from "react";
import { Pointer } from "lucide-react";

type PokeMember = {
  meetingMemberId: number;
  nickname: string;
};

type BookReportPokeModalProps = {
  isOpen: boolean;
  isClosing: boolean;
  members: PokeMember[];
  pokingMemberIds: number[];
  isPokingAll: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onPoke: (meetingMemberId: number) => boolean | Promise<boolean>;
  onPokeAll: (meetingMemberIds: number[]) => number[] | Promise<number[]>;
};

export default function BookReportPokeModal({
  isOpen,
  isClosing,
  members,
  pokingMemberIds,
  isPokingAll,
  errorMessage,
  onClose,
  onPoke,
  onPokeAll,
}: BookReportPokeModalProps) {
  const [animatingMemberIds, setAnimatingMemberIds] = useState<number[]>([]);
  const shouldRender = isOpen || isClosing;
  const isVisible = isOpen && !isClosing;
  const hasMembers = members.length > 0;
  const columnCount = Math.min(Math.max(members.length, 1), 4);

  if (!shouldRender) return null;

  const startAnimation = (memberIds: number[]) => {
    setAnimatingMemberIds((prev) => Array.from(new Set([...prev, ...memberIds])));
  };

  const stopAnimation = (memberId: number) => {
    setAnimatingMemberIds((prev) => prev.filter((id) => id !== memberId));
  };

  return (
    <div
      className={`fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[500px] -translate-x-1/2 items-center justify-center px-6 ${
        isVisible ? "animate-fade-in" : "animate-fade-out"
      }`}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
      />

      <div
        className={`relative z-10 w-full max-w-[420px] rounded-[28px] bg-white px-5 pb-5 pt-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-200 ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="text-center">
          <h2 className="text-subheading text-gray-900">미제출 인원 콕 찌르기</h2>
          <p className="mt-3 text-label text-gray-500">
            손가락 아이콘을 누르면 미제출 모임원에게 알림이 전송됩니다.
          </p>
        </div>

        {hasMembers ? (
          <div
            className="mt-6 grid gap-x-3 gap-y-4"
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {members.map((member) => {
              const isPoking = pokingMemberIds.includes(member.meetingMemberId);
              const isAnimating = animatingMemberIds.includes(member.meetingMemberId);

              return (
                <div
                  key={member.meetingMemberId}
                  className="flex min-w-0 flex-col items-center gap-3 rounded-2xl bg-gray-50 px-3 py-4"
                >
                  <p className="w-full truncate text-center text-sm !font-[600] text-gray-900">
                    {member.nickname}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      const shouldAnimate = await onPoke(member.meetingMemberId);
                      if (shouldAnimate) {
                        startAnimation([member.meetingMemberId]);
                      }
                    }}
                    disabled={isPoking || isPokingAll}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/15 bg-primary-purple-3 text-primary transition hover:-translate-y-0.5 hover:bg-primary-purple-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`${member.nickname}님에게 콕 찌르기 알림 보내기`}
                  >
                    <Pointer
                      className={`h-5 w-5 ${isAnimating ? "animate-poke-vertical" : ""}`}
                      onAnimationEnd={() => stopAnimation(member.meetingMemberId)}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            지금은 찌를 미제출 인원이 없어요.
          </div>
        )}

        {errorMessage ? (
          <p className="mt-4 text-center text-label !font-[500] text-red-500">{errorMessage}</p>
        ) : null}

        <button
          type="button"
          onClick={async () => {
            const acceptedMemberIds = await onPokeAll(
              members.map((member) => member.meetingMemberId),
            );
            if (acceptedMemberIds.length > 0) {
              startAnimation(acceptedMemberIds);
            }
          }}
          disabled={!hasMembers || isPokingAll}
          className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isPokingAll ? "전체 찌르는 중..." : "전체 찌르기"}
        </button>
      </div>
    </div>
  );
}
