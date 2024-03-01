import { ProductType } from '../ProductType/ProductType.type';

export type FacilityDetails = {
  id: string;
  name: string;
  address: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  productTypes?: ProductType[];
};
