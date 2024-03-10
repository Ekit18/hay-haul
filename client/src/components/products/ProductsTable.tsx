import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { Product } from '@/lib/types/Product/Product.type';
import { DataWithCount } from '@/lib/types/types';
import { useCurrentProductContext } from '@/pages/farmer-pages/contexts/currentProductContext';
import { DeleteModal } from '../delete-modal/delete-modal';
import { columns } from './data-table/columns';
import { DataTable } from './data-table/data-table';
import { useDeleteModalCurrentProduct } from './hooks/delete-modal-current-product';
import { useUpdateModalCurrentProduct } from './hooks/update-modal-current-product copy';
import { UpdateProductModal } from './modals/update-product-modal/update-product-modal';

export interface ProductsTableProps {
  data: DataWithCount<Product> | undefined;
  isLoading: boolean;
}

export function ProductsTable({ data, isLoading }: ProductsTableProps) {
  const { handleDeleteModalOpenChange, isDeleteModalOpen, deleteCallback, deleteModalConfirmName } =
    useDeleteModalCurrentProduct();

  const { handleUpdateModalOpenChange, isUpdateModalOpen, updateCallback } = useUpdateModalCurrentProduct();

  const { currentProduct } = useCurrentProductContext();

  return (
    <>
      <DataTable isLoading={isLoading} columns={columns} data={data?.data || []} pageCount={data?.count} />
      <DeleteModal
        handleOpenChange={handleDeleteModalOpenChange}
        open={isDeleteModalOpen}
        name={deleteModalConfirmName}
        entityTitle={EntityTitle.Product}
        deleteCallback={deleteCallback}
      />
      {currentProduct && (
        <UpdateProductModal
          product={currentProduct}
          handleOpenChange={handleUpdateModalOpenChange}
          open={isUpdateModalOpen}
          updateCallback={updateCallback}
        />
      )}
    </>
  );
}
