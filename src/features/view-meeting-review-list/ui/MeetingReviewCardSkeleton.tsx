export default function MeetingReviewCardSkeleton() {
  return (
    <div className="border-b border-gray-200 py-5 first:pt-2">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      <div className="mt-4 h-8 w-16 rounded bg-gray-200 animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
