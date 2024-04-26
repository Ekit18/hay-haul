import { SortOrder } from 'src/lib/enums/enums';
import { DeliveryStatus } from '../delivery.entity';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsArray, IsEnum } from 'class-validator';

export const deliveriesSortKeys = ['statusSort'] as const;
export type DeliveriesSortKeys = (typeof deliveriesSortKeys)[number];

export class FilterDeliveriesDto {
    @IsNumber()
    @IsOptional()
    limit?: number;

    @IsNumber()
    @IsOptional()
    offset?: number;

    @IsString()
    @IsOptional()
    productName?: string;

    @IsString()
    @IsOptional()
    transportId?: string;

    @IsString()
    @IsOptional()
    driverId?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(DeliveryStatus, { each: true })
    @Transform(({ value }) =>
        value ? value.split(',').map((k) => DeliveryStatus[k]) : [],
    )
    deliveriesStatus?: DeliveryStatus[];

    @IsEnum(SortOrder)
    @IsOptional()
    deliveriesStatusSort?: SortOrder;
}