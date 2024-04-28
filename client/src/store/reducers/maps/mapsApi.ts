import { api } from "@/store/api";

export type GetGoogleMapLinkWithPreviewByAddressesResponse = {
    mapLink: string;
    mapPreviewLink: string;
}

export type GetGoogleMapLinkWithPreviewByAddressesRequestDto = {
    from: string;
    to: string;
}

export const mapsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getGoogleMapLinkWithPreviewByAddresses: builder.query<GetGoogleMapLinkWithPreviewByAddressesResponse, URLSearchParams>({
            query: (params) => ({
                url: 'map',
                params
            })
        })
    })
})