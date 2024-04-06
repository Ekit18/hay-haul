type Ratio = {
  label: string;
  value: number;
};

export const buyoutPriceRatios: Ratio[] = [
  { label: '10%', value: 0.1 },
  { label: '50%', value: 0.5 },
  { label: '70%', value: 0.7 }
];

export const addDaysRatios: Ratio[] = [
  { label: '1d', value: 1 },
  { label: '7d', value: 7 },
  { label: '14d', value: 14 }
];

export const addBidStepsRatios: Ratio[] = [
  {
    label: '1 step',
    value: 1
  },
  {
    label: '5 steps',
    value: 5
  },
  {
    label: '10 step',
    value: 10
  }
];
