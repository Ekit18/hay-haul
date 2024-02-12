import { toast } from '@/components/ui/use-toast';
import { isErrorWithMessage } from '@/lib/helpers/isErrorWithMessage';
import { isFetchBaseQueryError } from '@/lib/helpers/isFetchBaseQueryError';
import { FetchError } from '@/store/api';

export const handleRtkError = (error: unknown) => {
  if (isErrorWithMessage(error)) {
    toast({
      variant: 'destructive',
      title: 'Something went wrong',
      description: error.message
    });
  } else if (isFetchBaseQueryError(error)) {
    const errMsg = 'error' in error ? error.error : (error as FetchError).data.message;
    toast({
      variant: 'destructive',
      title: 'Something went wrong',
      description: errMsg
    });
  }
};
