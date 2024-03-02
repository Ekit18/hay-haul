import { Product } from '@/lib/types/Product/Product.type';
import { ValueOf } from '@/lib/types/types';
import { Dispatch, PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

export const CurrentProductUsageContext = {
  Delete: 'Delete',
  Edit: 'Edit'
} as const;
export type CurrentProductUsageContextValues = ValueOf<typeof CurrentProductUsageContext>;

export type CurrentProductContextType = {
  currentProduct: Product | null;
  setCurrentProduct: Dispatch<React.SetStateAction<Product | null>>;
  usageContext: CurrentProductUsageContextValues | null;
  setUsageContext: Dispatch<React.SetStateAction<CurrentProductUsageContextValues | null>>;
};
export const CurrentProductContext = createContext<CurrentProductContextType | null>(null);

export function CurrentProductContextProvider({ children }: PropsWithChildren) {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [usageContext, setUsageContext] = useState<CurrentProductUsageContextValues | null>(null);
  const currentProductContextValue = useMemo<CurrentProductContextType>(
    () => ({ currentProduct, setCurrentProduct, usageContext, setUsageContext }),
    [currentProduct, setCurrentProduct]
  );
  return <CurrentProductContext.Provider value={currentProductContextValue}>{children}</CurrentProductContext.Provider>;
}

export const useCurrentProductContext: () => CurrentProductContextType = () => {
  return useContext(CurrentProductContext)!;
};
