import { mapsApi } from '@/store/reducers/maps/mapsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { Loader2, Maximize } from 'lucide-react';
import { useMemo } from 'react';

export type GMapPreviewProps = { fromAddress: string; toAddress: string };

export function GMapPreview({ fromAddress, toAddress }: GMapPreviewProps) {
  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('from', fromAddress);
    params.set('to', toAddress);

    return params;
  }, [fromAddress, toAddress]);

  const { data, isLoading, isFetching, isUninitialized } = mapsApi.useGetGoogleMapLinkWithPreviewByAddressesQuery(
    searchParams || skipToken
  );

  return (
    <div className="flex h-72 w-72 items-center justify-center ">
      {isLoading || isFetching || isUninitialized ? (
        <Loader2 className="h-10 w-10 animate-spin " />
      ) : (
        <div className="relative rounded border border-input">
          <img className="h-full w-full rounded" src={data?.mapPreviewLink} alt={'Map'} />

          <a
            href={data?.mapLink}
            target="_blank"
            className="absolute bottom-0 flex w-full justify-between rounded bg-white px-3 py-2"
          >
            Create route
            <span className="border-l border-input pl-2">
              <Maximize />
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
