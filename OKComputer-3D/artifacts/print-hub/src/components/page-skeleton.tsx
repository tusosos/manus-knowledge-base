import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72 bg-muted" />
        <Skeleton className="h-5 w-96 bg-muted" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-28 rounded-xl bg-muted" />
        <Skeleton className="h-28 rounded-xl bg-muted" />
        <Skeleton className="h-28 rounded-xl bg-muted" />
      </div>
      <Skeleton className="h-64 rounded-xl bg-muted" />
      <Skeleton className="h-48 rounded-xl bg-muted" />
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl bg-muted" />
      ))}
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 bg-muted" />
          <Skeleton className="h-5 w-96 bg-muted" />
        </div>
        <Skeleton className="h-10 w-24 bg-muted rounded-md" />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-52 space-y-2">
            <Skeleton className="h-5 w-24 bg-muted" />
            <Skeleton className="h-32 rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
