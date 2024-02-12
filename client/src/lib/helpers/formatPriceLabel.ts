import { UserCurrency } from '../types/User/UserCurrency.type';

export const formatPriceLabel = (value: number, currency: UserCurrency, rate: number): string => {
  return `${(value * rate).toFixed(0)}${currency}`;
};
