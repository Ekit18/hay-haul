type BuyoutPriceRatio = {
  label: string;
  value: number;
};

type AddDaysRatio = {
  label: string;
  value: number;
};

export const buyoutPriceRatios: BuyoutPriceRatio[] = [
  { label: '10%', value: 0.1 },
  { label: '50%', value: 0.5 },
  { label: '70%', value: 0.7 }
];

export const addDaysRatios: AddDaysRatio[] = [
  { label: '1d', value: 1 },
  { label: '7d', value: 7 },
  { label: '14d', value: 14 }
];
