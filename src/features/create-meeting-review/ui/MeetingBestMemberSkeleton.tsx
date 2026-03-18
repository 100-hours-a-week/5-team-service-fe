export default function MeetingBestMemberSkeleton() {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto py-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <button
          key={`best-member-skeleton-${index}`}
          type="button"
          disabled
          aria-hidden="true"
          className="flex w-20 shrink-0 flex-col items-center gap-2 rounded-lg border border-transparent p-2"
        >
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-full rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="relative w-full">
            <p className="w-full truncate text-center text-caption text-transparent select-none">
              placeholder
            </p>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-12 -translate-x-1/2 -translate-y-1/2 rounded bg-gray-200 animate-pulse" />
          </div>
        </button>
      ))}
    </div>
  );
}
