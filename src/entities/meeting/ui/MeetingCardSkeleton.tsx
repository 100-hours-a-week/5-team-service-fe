export const Skeleton = () => {
  return (
    <div className="flex h-[330px] flex-col rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-32 w-full overflow-hidden rounded-t-3xl bg-gray-200 animate-pulse" />
      <div className="mt-4 flex flex-1 flex-col px-4 pb-6">
        <div>
          <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="mt-2 h-5 w-2/3 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="mt-auto space-y-1">
          <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
