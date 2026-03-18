export default function MeetingReviewCardDetailSkeleton() {
  return (
    <div className="border-b border-gray-200 px-3 py-5 first:pt-2">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 animate-pulse" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      <div className="mt-4 h-5 w-16 rounded bg-gray-200 animate-pulse" />

      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="mt-4 flex gap-3 overflow-hidden">
        <div className="h-28 w-28 shrink-0 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-28 w-28 shrink-0 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-28 w-28 shrink-0 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
