import { handleRtkError } from '@/lib/helpers/handleRtkError';
import {
  CurrentProductUsageContext,
  useCurrentProductContext
} from '@/pages/farmer-pages/contexts/currentProductContext';
import { productsApi } from '@/store/reducers/products/productsApi';
import { useCallback, useMemo } from 'react';
import { UpdateProductFormValues } from '../modals/update-product-modal/validation';

export type UpdateModalProductHookResponse = {
  updateCallback: (data: UpdateProductFormValues) => Promise<void>;
  isUpdateModalOpen: boolean;
  handleUpdateModalOpenChange: (open: boolean) => void;
};

export function useUpdateModalCurrentProduct(): UpdateModalProductHookResponse {
  const { currentProduct, setCurrentProduct, usageContext, setUsageContext } = useCurrentProductContext();
  const [updateProduct] = productsApi.useUpdateProductMutation();
  const setAllNulls = () => {
    setUsageContext(null);
    setCurrentProduct(null);
  };
  const updateCallback = useCallback(
    async (data: UpdateProductFormValues) => {
      if (!currentProduct) {
        return;
      }
      await updateProduct({ id: currentProduct.id, body: data })
        .unwrap()
        .then(() => {
          setAllNulls();
        })
        .catch(handleRtkError);
    },
    [currentProduct?.id]
  );
  const isUpdateModalOpen = useMemo(() => usageContext === CurrentProductUsageContext.Edit, [usageContext]);
  const handleUpdateModalOpenChange = (open: boolean) => {
    if (!open) {
      setAllNulls();
    }
  };

  return {
    updateCallback,
    isUpdateModalOpen,
    handleUpdateModalOpenChange
  };
}
