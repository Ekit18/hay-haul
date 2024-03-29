import { ProductType } from '../ProductType/ProductType.type';
import { User } from '../User/User.type';

export type FacilityDetails = {
  id: string;
  name: string;
  address: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  productTypes?: ProductType[];
  user?: User;
};
