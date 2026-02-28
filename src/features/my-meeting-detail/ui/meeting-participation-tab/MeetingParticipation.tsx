import type { MeetingRound } from "../../api/types";

type MeetingParticipationProps = {
  round: MeetingRound;
  onJoin: (meetingLink: string) => void;
};

export default function MeetingParticipation({ round, onJoin }: MeetingParticipationProps) {
  const meetingEndPassed = round.dday < 0;
  const hasMeetingLink = Boolean(round.meetingLink);
  const canJoin = Boolean(round.canJoinMeeting);

  const joinLabel = meetingEndPassed
    ? "종료된 모임입니다."
    : !hasMeetingLink
      ? "현재는 참여 가능 시간이 아닙니다."
      : canJoin
        ? "모임 참여하기"
        : "독후감 미제출로 이번 모임은 참여하실 수 없어요.";

  const joinButtonClass =
    !meetingEndPassed && hasMeetingLink && canJoin
      ? "bg-primary-purple text-white"
      : "bg-gray-200 text-gray-500";

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900">모임 참여하기</h2>
        <span className="rounded-full bg-primary-purple px-2 py-1 text-micro !font-[600] text-white">
          {round.dday === 0
            ? "Today"
            : round.dday > 0
              ? `D - ${round.dday}`
              : `D + ${Math.abs(round.dday)}`}
        </span>
      </div>

      <p className="text-xs text-gray-500">모임 시작 10분 전부터 모임방이 활성화됩니다.</p>

      <button
        type="button"
        onClick={() => {
          if (meetingEndPassed || !hasMeetingLink || !canJoin || !round.meetingLink) return;
          onJoin(round.meetingLink);
        }}
        disabled={meetingEndPassed || !hasMeetingLink || !canJoin}
        className={`h-12 w-full rounded-xl text-sm font-semibold ${joinButtonClass}`}
      >
        {joinLabel}
      </button>
    </section>
  );
}
