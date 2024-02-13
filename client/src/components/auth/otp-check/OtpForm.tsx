import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { OtpFormValues, otpDefaultValues, useOtpFormSchema } from './validation';

export function OtpForm() {
  const otpFormSchema = useOtpFormSchema();
  const form = useForm<OtpFormValues>({
    mode: 'onBlur',
    defaultValues: otpDefaultValues,
    resolver: yupResolver(otpFormSchema)
  });

  const onSubmit: SubmitHandler<OtpFormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-center items-center gap-10"
        >
          <FormField
            control={form.control}
            name="otpValue"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <OtpInput
                    value={field.value}
                    onChange={field.onChange}
                    numInputs={4}
                    renderSeparator={<span> </span>}
                    renderInput={(props) => (
                      <input name="otpValue" {...props} className="border-b-2 first:ml-0 ml-4 text-3xl" />
                    )}
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          <Button variant="link" className="text-blue-900">
            Request New Code
          </Button>
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
