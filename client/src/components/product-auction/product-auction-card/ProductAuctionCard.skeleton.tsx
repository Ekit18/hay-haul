import { Skeleton } from '@/components/ui/skeleton';

export function ProductAuctionCardSkeleton() {
  return (
    <div className="min-[1068px]:w-full w-full flex flex-col min-[1068px]:flex-row gap-4 justify-start items-center rounded-lg bg-white">
      <div className="w-full min-[1068px]:h-full min-[1068px]:w-4/12 xl:w-3/12">
        <Skeleton className="h-40 min-[1068px]:h-full w-full  object-cover min-[1068px]:rounded-l-lg rounded-t-lg min-[1068px]:rounded-tr-none" />
      </div>
      <div className="w-full min-[1068px]:py-4 min-[1068px]:w-5/12 xl:w-6/12">
        <div className="w-full flex flex-col min-[1068px]:pr-4 px-4 gap-4 min-[1068px]:border-r-2">
          <div className="flex flex-row justify-start items-center gap-3">
            <Skeleton className="font-semibold text-xl text-left w-max" />
            <Skeleton className="w-max p-2 rounded-lg text-sm whitespace-nowrap" />
          </div>

          <div className="w-full flex flex-row justify-left gap-4">
            <Skeleton className="w-full" />
            <Skeleton className="w-full" />
          </div>
          <Skeleton className=" rounded p-2 w-full text-base" />
          <Skeleton className=" rounded p-2 w-full text-base" />

          <Skeleton className=" rounded p-2 w-full text-base" />
        </div>
      </div>
      <div className="min-[1068px]:pr-4 px-4 pb-4 gap-4 flex flex-col min-[1068px]:py-4 min-[1068px]:pl-0 min-[1068px]:w-3/12 w-full">
        <div className="border-b-2 pb-4">
          <Skeleton className="text-center" />
          <Skeleton className="text-center" />
        </div>
        <div className="w-full text-center flex flex-col gap-2">
          <Skeleton className="text-center" />
          <Skeleton className="font-bold text-2xl" />
        </div>
        <div className="w-full text-center flex flex-col gap-2">
          <Skeleton className="w-full text-primary border-primary border" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </div>
      </div>
    </div>
  );
}
