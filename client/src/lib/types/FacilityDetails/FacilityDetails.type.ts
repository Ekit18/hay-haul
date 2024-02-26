import { ProductType } from '../ProductType/ProductType.type';

export type FacilityDetails = {
  id: string;
  name: string;
  address: string;
  code: string;
  productTypes: ProductType[];
  createdAt: string;
  updatedAt: string;
};
