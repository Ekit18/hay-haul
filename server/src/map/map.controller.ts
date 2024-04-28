import { Controller, Get, Query } from '@nestjs/common';
import { IsString } from 'class-validator';
import { MapService } from './map.service';
import { GetGoogleMapLinkWithPreviewByAddressesRequestDto } from './dto/get-google-map-link-with-preview-by-addresses-request.dto';
import { GetGoogleMapLinkWithPreviewByAddressesResponse } from './dto/get-google-map-link-with-preview-by-addresses-request.response';



@Controller('map')
export class MapController {
    constructor(private mapService: MapService) { }
    @Get()
    getGoogleMapLinkWithPreviewByAddresses(@Query() query: GetGoogleMapLinkWithPreviewByAddressesRequestDto): Promise<GetGoogleMapLinkWithPreviewByAddressesResponse> {
        return this.mapService.getGoogleMapLinkWithPreviewByAddresses(query);
    }
}
