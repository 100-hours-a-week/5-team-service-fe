import type { MeetingRound } from "../../api/types";
import {
  reportActionLabel,
  ReportStatus,
  reportStatusClass,
  reportStatusLabel,
} from "../../model/types";

type BookReportSubmitProps = {
  round: MeetingRound;
  onOpenBookReport: () => void;
};

export default function BookReportSubmit({ round, onOpenBookReport }: BookReportSubmitProps) {
  const rawStatus = round.bookReport.status ?? "NOT_SUBMITTED";
  const status: ReportStatus =
    rawStatus in reportStatusLabel ? (rawStatus as ReportStatus) : "NOT_SUBMITTED";

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900">독후감 제출하기</h2>
        <span className={`rounded-full px-2 py-1 text-micro ${reportStatusClass[status]}`}>
          {reportStatusLabel[status]}
        </span>
      </div>

      <p className="text-xs text-gray-500">모임 시작 전까지 독후감을 제출해야합니다.</p>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
        <div className="h-20 w-16 overflow-hidden rounded-xl bg-gray-100">
          {round.book.thumbnailUrl ? (
            <img
              src={round.book.thumbnailUrl}
              alt={round.book.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">{round.book.publisher}</p>
          <p className="text-sm font-semibold text-gray-900">{round.book.title}</p>
          <p className="text-xs text-gray-500">{round.book.authors}</p>
          <p className="text-xs text-gray-400">{round.book.publishedAt?.slice(0, 4)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenBookReport}
        className="mt-5 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white"
      >
        {reportActionLabel[status]}
      </button>
    </section>
  );
}
