import { Skeleton } from '@/components/ui/skeleton';

export function ProductAuctionCardSkeleton() {
  return (
    <div className="flex min-h-72 w-full flex-col items-center justify-start gap-4 rounded-lg bg-white min-[1068px]:w-full min-[1068px]:flex-row">
      <div className="w-full min-[1068px]:h-full min-[1068px]:w-4/12 xl:w-3/12">
        <Skeleton className="h-40 w-full rounded-t-lg  object-cover min-[1068px]:h-full min-[1068px]:rounded-l-lg min-[1068px]:rounded-tr-none" />
      </div>
      <div className="w-full min-[1068px]:w-5/12 min-[1068px]:py-4 xl:w-6/12">
        <div className="flex w-full flex-col gap-4 px-4 min-[1068px]:border-r-2 min-[1068px]:pr-4">
          <div className="flex flex-row items-center justify-start gap-3">
            <Skeleton className="h-8 w-full whitespace-nowrap rounded-lg p-2 text-sm" />
            <Skeleton className="h-8  w-14 whitespace-nowrap rounded-lg p-2 text-sm" />
          </div>

          <div className="justify-left flex h-4 w-full flex-row gap-4">
            <Skeleton className="w-full" />
            <Skeleton className="w-full" />
          </div>
          <Skeleton className=" h-14 w-full rounded p-2" />
          <Skeleton className=" h-5 w-full rounded p-2" />

          <Skeleton className=" w-1/2 rounded p-2" />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 px-4 pb-4 min-[1068px]:w-3/12 min-[1068px]:py-4 min-[1068px]:pl-0 min-[1068px]:pr-4">
        <div className="flex flex-col items-center justify-center gap-2 border-b-2 pb-4">
          <Skeleton className="h-4 w-1/3 text-center" />
          <Skeleton className="h-5 w-3/4 text-center" />
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <Skeleton className="h-4 w-1/2 text-center" />
          <Skeleton className="h-11 w-1/2" />
        </div>
        <div className="flex w-full flex-col gap-2 text-center">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}
