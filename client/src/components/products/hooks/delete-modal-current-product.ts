import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import {
  CurrentProductUsageContext,
  useCurrentProductContext
} from '@/pages/farmer-pages/contexts/currentProductContext';
import { productsApi } from '@/store/reducers/products/productsApi';
import { useCallback, useMemo } from 'react';

export type DeleteModalProductHookResponse = {
  deleteCallback: () => Promise<void>;
  isDeleteModalOpen: boolean;
  deleteModalConfirmName: string;
  handleDeleteModalOpenChange: (open: boolean) => void;
};

export function useDeleteModalCurrentProduct(): DeleteModalProductHookResponse {
  const { currentProduct, setCurrentProduct, usageContext, setUsageContext } = useCurrentProductContext();
  const [deleteProduct] = productsApi.useDeleteProductMutation();
  const setAllNulls = () => {
    setUsageContext(null);
    setCurrentProduct(null);
  };
  const deleteCallback = useCallback(async () => {
    if (!currentProduct) {
      return;
    }
    await deleteProduct(currentProduct.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Product was deleted',
          description: 'Your product has been deleted successfully.'
        });
        setAllNulls();
      })
      .catch(handleRtkError);
  }, [currentProduct?.id]);
  const isDeleteModalOpen = useMemo(() => usageContext === CurrentProductUsageContext.Delete, [usageContext]);
  const deleteModalConfirmName = useMemo(() => currentProduct?.name || '', [currentProduct?.name]);
  const handleDeleteModalOpenChange = (open: boolean) => {
    if (!open) {
      setAllNulls();
    }
  };

  return {
    deleteCallback,
    isDeleteModalOpen,
    deleteModalConfirmName,
    handleDeleteModalOpenChange
  };
}
