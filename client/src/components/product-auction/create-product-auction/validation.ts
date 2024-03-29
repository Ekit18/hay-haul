import { FileObject } from '@/components/drag-and-drop/file-object.type';
import { AnyObject, ObjectSchema, date, mixed, number, object, ref, string } from 'yup';

export type CreateProductAuctionFormValues = {
  startPrice: number;
  buyoutPrice: number;
  startDate: Date;
  endDate: Date;
  paymentPeriod: Date;
  bidStep: number;
  description: string;
  productId: string;
  farmId: string;
  photos: FileObject[];
};

export const createProductAuctionDefaultValues: CreateProductAuctionFormValues = {
  startPrice: 0,
  buyoutPrice: 0,
  startDate: new Date(),
  endDate: new Date(),
  paymentPeriod: new Date(),
  bidStep: 0,
  description: '',
  productId: '',
  farmId: '',
  photos: []
};

export const useProductAuctionCreateFormSchema = (): ObjectSchema<
  CreateProductAuctionFormValues,
  AnyObject,
  {
    startPrice: undefined;
    buyoutPrice: undefined;
    startDate: undefined;
    endDate: undefined;
    paymentPeriod: undefined;
    bidStep: undefined;
    description: undefined;
    productId: undefined;
    farmId: undefined;
  },
  ''
> => {
  return object({
    startPrice: number()
      .required('Start price is required')
      .positive('Start price must be positive')
      .min(0, 'Start price must be greater than 0'),
    buyoutPrice: number()
      .required('Buyout price is required')
      .positive('Buyout price must be positive')
      .min(0, 'Buyout price must be greater than 0'),
    startDate: date()
      .required('Start date is required')
      .min(new Date(), 'Start date must be greater than current date'),
    endDate: date().required('End date is required').min(ref('startDate'), 'End date must be greater than start date'),
    paymentPeriod: date()
      .required('Payment period is required')
      .min(ref('endDate'), 'Payment period must be greater than end date'),
    bidStep: number()
      .required('Bid step is required')
      .positive('Bid step must be positive')
      .min(0, 'Bid step must be greater than 0'),
    description: string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    productId: string().required('Product is required'),
    farmId: string().required('Farm is required'),
    photos: mixed<FileObject[]>().required('Photos are required')
  });
};
