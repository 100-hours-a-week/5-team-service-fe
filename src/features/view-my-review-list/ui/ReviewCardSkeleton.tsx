export default function ReviewCardSkeleton() {
  return (
    <div className="animate-pulse border-b border-gray-200 py-5">
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-3 w-1/3 rounded bg-gray-100" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
      </div>
      <div className="mt-3 h-3 w-20 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-full rounded bg-gray-100" />
    </div>
  );
}
