import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { formatKoreanMonthDayHourMinute } from "@/shared/lib/formatKoreanMonthDayHourMinute";

type RoundSelectorProps = {
  roundNo: number;
  meetingDate: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function RoundSelector({
  roundNo,
  meetingDate,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: RoundSelectorProps) {
  const formatted = meetingDate ? formatKoreanMonthDayHourMinute(meetingDate) : "-";
  const parsed = formatted.match(/^(\d{2}월\d{2}일)\s+(\d{1,2}):(\d{2})$/);
  const dateLabel = parsed?.[1] ?? "-";
  const timeLabel = parsed ? `${parsed[2]}시 ${parsed[3]}분` : "-";

  return (
    <section className="relative rounded-xl border border-gray-300 px-12 py-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="absolute inset-y-0 left-3 flex w-8 items-center justify-center disabled:opacity-40"
        aria-label="이전 회차"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
      </button>

      <div className="text-center">
        <span className="text-body-1 !font-[600] text-gray-900">{roundNo}회차</span>
      </div>

      <p className="mt-1 text-center text-label !font-[400] text-gray-500">
        날짜: {dateLabel} · 시각: {timeLabel}
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="absolute inset-y-0 right-3 flex w-8 items-center justify-center disabled:opacity-40"
        aria-label="다음 회차"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-700" />
      </button>
    </section>
  );
}
