import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetGoogleMapLinkWithPreviewByAddressesRequestDto } from './dto/get-google-map-link-with-preview-by-addresses-request.dto';
import { GetGoogleMapLinkWithPreviewByAddressesResponse } from './dto/get-google-map-link-with-preview-by-addresses-request.response';

@Injectable()
export class MapService {

    async getGoogleMapLinkWithPreviewByAddresses({ from, to }: GetGoogleMapLinkWithPreviewByAddressesRequestDto): Promise<GetGoogleMapLinkWithPreviewByAddressesResponse> {
        try {
            const mapLink = `https://www.google.com/maps/dir/${from}/${to}`

            const openTagsSearchParams = new URLSearchParams();
            openTagsSearchParams.set('url', encodeURI(mapLink));
            const res = await fetch('https://opentags.io/.netlify/functions/meta-fetcher?' + openTagsSearchParams.toString())
            const { data: { image: mapPreviewLink } } = await res.json() as { data: { image: string } }
            return { mapLink, mapPreviewLink }
        } catch {
            throw new InternalServerErrorException({ message: 'Failed to get image preview' })
        }
    }
}
