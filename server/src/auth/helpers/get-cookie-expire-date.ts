import { ONE_DAY_IN_MILLISECONDS } from '../constants/cookie.constants';

export const getCookieExpireDate = (days: string): Date => {
  const daysAsNumber = Number(days.slice(0, -1));
  return new Date(Date.now() + daysAsNumber * ONE_DAY_IN_MILLISECONDS);
};
