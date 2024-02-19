import { SortOrder } from 'src/lib/enums/enums';

export type ProductQuery = {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: SortOrder;
};
