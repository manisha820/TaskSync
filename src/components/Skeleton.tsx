import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-white/5",
        variant === 'circle' ? "rounded-full" : "rounded-none",
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-40 w-full min-w-[240px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
}
