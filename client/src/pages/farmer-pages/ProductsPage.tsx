import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsFilter } from '@/components/products/product-filter/ProductsFilter';
import {
  ProductFilterFormValues,
  productFilterFormDefaultValues,
  useProductFilterFormSchema
} from '@/components/products/product-filter/validation';
import { Form } from '@/components/ui/form';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { productsApi } from '@/store/reducers/products/productsApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export function ProductsPage() {
  const productFilterFormSchema = useProductFilterFormSchema();

  const [filterProducts, { data }] = productsApi.useLazyFilterProductsQuery();

  useEffect(() => {
    (async () => {
      await filterProducts(new URLSearchParams())
        .unwrap()
        .then((data) => {
          console.log(data);
        })
        .catch(handleRtkError);
    })();
  }, []);

  const form = useForm<ProductFilterFormValues>({
    resolver: yupResolver(productFilterFormSchema),
    mode: 'onBlur',
    defaultValues: productFilterFormDefaultValues
  });
  const onSubmit: SubmitHandler<ProductFilterFormValues> = async (data) => {
    const { productTypeId, ...body } = data;

    const searchParams = new URLSearchParams();
    Object.entries({ ...body }).forEach(([key, value]) => searchParams.append(key, value as string));

    searchParams.append('productTypeId', productTypeId?.join(',') ?? '');

    await filterProducts(searchParams)
      .unwrap()
      .then((data) => {
        console.log(data);
      })
      .catch(handleRtkError);
  };

  return (
    <>
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6 mt-6 flex flex-col">
            <div className="p-4 bg-white">
              <h2 className="text-3xl font-bold mb-9">Products</h2>
              <ProductsFilter />
            </div>
            <ProductsTable data={data} />
          </form>
        </Form>
      </div>
    </>
  );
}
