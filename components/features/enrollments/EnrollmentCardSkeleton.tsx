import { Skeleton } from '@/components/shared/Loading/Skeleton'

/**
 * Enrollment Card Skeleton
 * 
 * Skeleton for enrollment card loading state.
 */
export function EnrollmentCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 md:gap-6">
        {/* Main Content */}
        <div className="flex-grow space-y-3 sm:space-y-4">
          {/* Title and Status */}
          <div className="flex flex-col xs:flex-row xs:flex-wrap xs:items-center gap-2 xs:gap-3">
            <Skeleton className="h-6 w-48 sm:w-64" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-4 md:gap-x-8">
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 sm:size-5 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 sm:size-5 rounded" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 sm:size-5 rounded" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1.5 sm:h-2 w-full rounded-full" />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex lg:min-w-[140px] xl:min-w-[160px]">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

/**
 * Multiple Enrollment Card Skeletons
 */
export function EnrollmentCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EnrollmentCardSkeleton key={i} />
      ))}
    </div>
  )
}
