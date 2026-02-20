export const Skeleton = () => {
  return (
    <div className="h-38 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_6px_20px_rgba(20,24,40,0.05)]">
      <div className="flex h-full items-start gap-4">
        <div className="h-30 w-22 shrink-0 rounded-lg bg-gray-200 animate-pulse" />
        <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
          <div className="flex gap-2">
            <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
