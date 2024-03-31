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
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CurrentProductContextProvider } from './contexts/currentProductContext';

export function ProductsPage() {
  const productFilterFormSchema = useProductFilterFormSchema();

  const [filterProducts, { data, isLoading, isFetching, isUninitialized }] = productsApi.useLazyFilterProductsQuery();

  const form = useForm<ProductFilterFormValues>({
    resolver: yupResolver(productFilterFormSchema),
    mode: 'onBlur',
    defaultValues: productFilterFormDefaultValues
  });

  const onSubmit: SubmitHandler<ProductFilterFormValues> = async (data) => {
    if (isLoading || isFetching) return;

    const searchParams = new URLSearchParams();
    const { productTypeId, ...body } = data;

    Object.entries({ ...body })
      .filter(([_key, value]) => Boolean(value))
      .forEach(([key, value]) => searchParams.append(key, value as string));

    searchParams.append('productTypeId', productTypeId?.join(',') ?? '');

    await filterProducts(searchParams).unwrap().catch(handleRtkError);
  };

  const firstRender = useRef(true);
  useEffect(() => {
    const getFunction = () => {
      if (!isLoading || !isFetching) {
        onSubmit(form.getValues());
      }
    };

    const debouncedFunction = debounce(getFunction, DEBOUNCE_DELAY);

    const watchSubscription = form.watch(() => {
      if (firstRender.current) {
        getFunction();
        firstRender.current = false;
        return;
      }
      debouncedFunction();
    });

    return () => {
      watchSubscription.unsubscribe();
      debouncedFunction.clear();
    };
  }, []);

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
                <ProductsTable data={data} isLoading={isLoading || isFetching || isUninitialized} />
              </div>
            </form>
          </Form>
        </div>
      </CurrentProductContextProvider>
    </>
  );
}
