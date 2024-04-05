export const formatAuctionDateHours = (date: Date) => {
  return new Date(date.setUTCHours(8, 0, 0, 0));
};
