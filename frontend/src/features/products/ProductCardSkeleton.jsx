import { Skeleton } from "../../components/ui/Skeleton.jsx";

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-3 h-3 w-2/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </div>
  );
}
