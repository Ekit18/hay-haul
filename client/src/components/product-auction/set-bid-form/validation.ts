import { AnyObject, ObjectSchema, number, object, ref, string } from 'yup';

export type SetBidFormValues = {
  price: number;
  auctionId: string;
  currentMaxBid: number | null;
  bidStep: number;
  startPrice: number;
};

export const useSetBidFormSchema = (): ObjectSchema<
  SetBidFormValues,
  AnyObject,
  {
    price: undefined;
    auctionId: undefined;
    currentMaxBid: undefined;
    bidStep: undefined;
    startPrice: undefined;
  },
  ''
> => {
  return object({
    price: number()
      .required('Price is required')
      .min(ref('startPrice'), 'Price must be greater than start price')
      .test('price', 'Price must be greater than current max bid on bid step', function (value) {
        console.log(value);
        return value >= this.parent.currentMaxBid + this.parent.bidStep;
      }),
    auctionId: string().required('Auction id is required'),
    currentMaxBid: number().required('Current max bid is required'),
    bidStep: number().required('Bid step is required'),
    startPrice: number().required('Start price is required')
  });
};
