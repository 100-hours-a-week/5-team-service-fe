import { BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

type MeetingDetailActionBarProps = {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isJoining: boolean;
  actionLabel: string;
  actionTone: "active" | "inactive";
  actionDisabled: boolean;
  onJoin: () => void;
};

export default function MeetingDetailActionBar({
  isBookmarked,
  onToggleBookmark,
  isJoining,
  actionLabel,
  actionTone,
  actionDisabled,
  onJoin,
}: MeetingDetailActionBarProps) {
  return (
    <div className="sticky bottom-0 bg-white px-6 pb-6 pt-3 shadow-[0_-10px_24px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-[56px_1fr] items-center gap-3">
        <button
          type="button"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={onToggleBookmark}
          className="flex h-12 w-14 items-center justify-center rounded-lg bg-gray-100 text-primary"
        >
          {isBookmarked ? (
            <BookmarkSolidIcon className="size-6" />
          ) : (
            <BookmarkOutlineIcon className="size-6" />
          )}
        </button>

        <button
          type="button"
          disabled={actionDisabled || isJoining}
          onClick={onJoin}
          className={`h-12 w-full rounded-lg text-sm font-semibold text-white transition ${
            actionTone === "active" ? "bg-primary" : "bg-primary/50"
          }`}
        >
          {isJoining ? "요청 중..." : actionLabel}
        </button>
      </div>
    </div>
  );
}
