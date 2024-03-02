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
import { SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { CurrentProductContextProvider } from './contexts/currentProductContext';

function Test() {
  const form = useFormContext();

  const s = form.watch();

  const [filterProducts, { isLoading, isFetching }] = productsApi.useLazyFilterProductsQuery();

  const onSubmit: SubmitHandler<ProductFilterFormValues> = async (data) => {
    if (isLoading || isFetching) return;

    const searchParams = new URLSearchParams();
    const { productTypeId, ...body } = data;
    // Govnocode
    Object.entries({ ...body }).forEach(([key, value]) => searchParams.append(key, value as string));
    console.log('onSubmit');

    searchParams.append('productTypeId', productTypeId?.join(',') ?? '');

    await filterProducts(searchParams).unwrap().catch(handleRtkError);
  };

  useEffect(() => {
    const debouncedFunction = debounce(() => onSubmit(s), DEBOUNCE_DELAY);

    (async () => {
      form.watch(async () => {
        console.log('watch');
        // await onSubmit(s);
        debouncedFunction();
      });
    })();

    return () => {
      debouncedFunction.clear();
    };
  }, [s]);
  return null;
}

export function ProductsPage() {
  const productFilterFormSchema = useProductFilterFormSchema();

  const [filterProducts, { data }] = productsApi.useLazyFilterProductsQuery();

  const form = useForm<ProductFilterFormValues>({
    resolver: yupResolver(productFilterFormSchema),
    mode: 'onBlur',
    defaultValues: productFilterFormDefaultValues
  });

  useEffect(() => {
    (async () => {
      await filterProducts(new URLSearchParams({ nameSort: 'DESC', quantitySort: 'DESC', productTypeSort: 'DESC' }))
        .unwrap()
        .catch(handleRtkError);
    })();
  }, []);

  // console.log(form.getValues());

  const onSubmit: SubmitHandler<ProductFilterFormValues> = async (data) => {
    const { productTypeId, ...body } = data;
    console.log(data);
    const searchParams = new URLSearchParams();
    Object.entries({ ...body }).forEach(([key, value]) => searchParams.append(key, value as string));

    searchParams.append('productTypeId', productTypeId?.join(',') ?? '');

    await filterProducts(searchParams).unwrap().catch(handleRtkError);
  };

  return (
    <>
      <CurrentProductContextProvider>
        <div className="">
          <Form {...form}>
            <Test />
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
