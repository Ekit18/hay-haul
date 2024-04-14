import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AppRoute } from '@/lib/constants/routes';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { paymentsApi } from '@/store/reducers/payments/paymentsApi';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentsPage() {
  const { data, isLoading, isError, error } = paymentsApi.useGetPaymentsByUserIdQuery();
  const navigate = useNavigate();
  if (isLoading || data) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  useEffect(() => {
    if (isError) {
      handleRtkError(error);
      navigate(AppRoute.General.Main);
    }
  }, [isError, error]);

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <div className="bg-white p-4">
          <h2 className="mb-9 mt-6 text-3xl font-bold">Payments</h2>
        </div>
      </div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
