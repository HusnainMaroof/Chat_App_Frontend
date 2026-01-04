const UsersLoadingSkeleton = () => {
  return (
    <div className="w-full flex flex-col h-full bg-[#0f172a]/80 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex h-[70px] items-center justify-between px-5">
        <div className="h-10 w-10 rounded-xl bg-slate-800" />
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-800" />
          <div className="h-8 w-8 rounded-lg bg-slate-800" />
        </div>
      </div>

      {/* Search Skeleton */}
      <div className="px-5 py-3">
        <div className="h-10 bg-slate-800/60 rounded-xl w-full" />
      </div>

      {/* List Skeleton */}
      <div className="flex-1 px-2 space-y-2 mt-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center px-3 h-[76px]">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 mr-4" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-800 rounded w-10" />
              </div>
              <div className="h-3 bg-slate-800/50 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UsersLoadingSkeleton;