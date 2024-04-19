import { IsNumber, IsOptional } from 'class-validator';

export class DeliveryOrderLocationsQueryResponse {
  fromFarmLocations: string[]
  toDepotLocations: string[]
}
