import { SortOrder } from 'src/lib/enums/enums';

export type ProductQuery = {
  limit?: number;
  offset?: number;
  sort?: SortOrder;
  searchQuery?: string;
  farmId?: string;
  productTypeId?: string[];
  minQuantity?: number;
  maxQuantity?: number;
};
