import { Skeleton } from '@/components/ui/skeleton';

export default function BrokerProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Broker summary */}
        <div className="flex-1 space-y-6">
          <Skeleton className="h-12 w-48 mb-2" />
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-40 w-full mb-6" />
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-1/2 mt-6" />
        </div>
        {/* Right: Details/reviews */}
        <div className="flex-1 space-y-6">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-8 w-1/3 mb-2" />
        </div>
      </div>
    </div>
  );
}
