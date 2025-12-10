const SkeletonBase = ({ className }) => (
  <div className={`bg-white/5 animate-pulse rounded-xl ${className}`} />
);

export const MovieCardSkeleton = () => (
  <div className="w-full">
    <SkeletonBase className="aspect-[2/3] mb-3 rounded-2xl" />
    <SkeletonBase className="h-4 w-3/4 mb-2" />
    <SkeletonBase className="h-3 w-1/2" />
  </div>
);

export const DetailsSkeleton = () => (
  <div className="min-h-screen bg-black relative">
    <div className="h-[50vh] bg-white/5 animate-pulse" />
    
    <div className="container mx-auto px-6 relative -mt-32 z-10">
      <div className="flex flex-col md:flex-row gap-8 items-end">
        {/* Poster */}
        <SkeletonBase className="w-52 h-80 shrink-0 shadow-2xl border border-white/10" />
        
        {/* Text Info */}
        <div className="flex-1 w-full space-y-4 mb-8">
          <SkeletonBase className="h-12 w-3/4" />
          <div className="flex gap-4">
            <SkeletonBase className="h-6 w-16" />
            <SkeletonBase className="h-6 w-16" />
            <SkeletonBase className="h-6 w-16" />
          </div>
          <div className="flex gap-4 pt-4">
             <SkeletonBase className="h-12 w-40 rounded-full" />
             <SkeletonBase className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="mt-12 space-y-3 max-w-3xl">
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-5/6" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {[...Array(10)].map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);

export const SkeletonRow = () => (
  <div className="flex gap-4 overflow-hidden pb-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="min-w-[140px] md:min-w-[180px]">
        <MovieCardSkeleton />
      </div>
    ))}
  </div>
);