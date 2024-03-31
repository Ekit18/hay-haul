import { FacilityDetails } from '../FacilityDetails/FacilityDetails.type';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { ProductType } from '../ProductType/ProductType.type';

export type Product = {
  id: string;
  name: string;
  quantity: number;
  facilityDetailsId: string;
  facilityDetails: FacilityDetails;
  productTypeId: string;
  productType: ProductType;
  createdAt: string;
  updatedAt: string;
  productAuction: Omit<ProductAuction, 'photos'>;
};
