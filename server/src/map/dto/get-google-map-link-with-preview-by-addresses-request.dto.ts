import { IsString } from 'class-validator';

export class GetGoogleMapLinkWithPreviewByAddressesRequestDto {
    @IsString()
    from: string;
    @IsString()
    to: string;
}