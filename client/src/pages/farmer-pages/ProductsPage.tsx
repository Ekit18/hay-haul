import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsFilter } from '@/components/products/product-filter/ProductsFilter';
import {
  ProductFilterFormValues,
  productFilterFormDefaultValues,
  useProductFilterFormSchema
} from '@/components/products/product-filter/validation';
import { Form } from '@/components/ui/form';
import { DEBOUNCE_DELAY } from '@/lib/constants/constants';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { productsApi } from '@/store/reducers/products/productsApi';
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'debounce';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CurrentProductContextProvider } from './contexts/currentProductContext';

export function ProductsPage() {
  const productFilterFormSchema = useProductFilterFormSchema();

  const [filterProducts, { data, isLoading, isFetching }] = productsApi.useLazyFilterProductsQuery();

  const form = useForm<ProductFilterFormValues>({
    resolver: yupResolver(productFilterFormSchema),
    mode: 'onBlur',
    defaultValues: productFilterFormDefaultValues
  });

  // useEffect(() => {
  //   (async () => {
  //     await filterProducts(
  //       new URLSearchParams({
  //         nameSort: SortOrder.DESC,
  //         quantitySort: SortOrder.DESC,
  //         productTypeSort: SortOrder.DESC,
  //         limit: String(10),
  //         offset: String(0)
  //       })
  //     )
  //       .unwrap()
  //       .catch(handleRtkError);
  //   })();
  // }, []);

  const watchedFields = form.watch();

  const onSubmit: SubmitHandler<ProductFilterFormValues> = async (data) => {
    if (isLoading || isFetching) return;

    const searchParams = new URLSearchParams();
    const { productTypeId, ...body } = data;

    console.log({ productTypeId, body });

    Object.entries({ ...body })
      .filter(([_key, value]) => Boolean(value))
      .forEach(([key, value]) => searchParams.append(key, value as string));

    searchParams.append('productTypeId', productTypeId?.join(',') ?? '');

    await filterProducts(searchParams).unwrap().catch(handleRtkError);
  };

  useEffect(() => {
    const debouncedFunction = debounce(() => (!isLoading || !isFetching) && onSubmit(form.getValues()), DEBOUNCE_DELAY);

    form.watch(() => {
      debouncedFunction();
    });

    return () => {
      debouncedFunction.clear();
    };
  }, [watchedFields]);

  return (
    <>
      <CurrentProductContextProvider>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6 mt-6 flex flex-col">
              <div className="p-4 bg-white">
                <h2 className="text-3xl font-bold mb-9">Products</h2>
                <ProductsFilter />
              </div>
              <div className="px-4">
                <ProductsTable data={data} />
              </div>
            </form>
          </Form>
        </div>
      </CurrentProductContextProvider>
    </>
  );
}
