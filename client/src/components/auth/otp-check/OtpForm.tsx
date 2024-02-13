import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { User } from '@/lib/types/User/User.type';
import { userApi } from '@/store/reducers/user/userApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { OtpFormValues, otpDefaultValues, useOtpFormSchema } from './validation';

type Properties = {
  onSetIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

export function OtpForm({ onSetIsSuccess }: Properties) {
  const user = useAppSelector((state) => state.userReducer.user as User);
  const otpFormSchema = useOtpFormSchema();
  const form = useForm<OtpFormValues>({
    mode: 'onBlur',
    defaultValues: otpDefaultValues,
    resolver: yupResolver(otpFormSchema)
  });

  const [verifyOtp] = userApi.useVerifyOtpMutation();
  const [newOtp] = userApi.useNewOtpMutation();

  const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    console.log(user);
    await verifyOtp({ otp: data.otpValue, dataType: 'userId', userData: user.id })
      .unwrap()

      .then(() => onSetIsSuccess(true))
      .catch(handleRtkError);
  };

  const handleNewOtp = async () => {
    await newOtp({ userData: user.id, dataType: 'userId', type: 'REGISTER' }).unwrap().catch(handleRtkError);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-center items-center gap-10"
        >
          <div className="text-base font-medium text-center ">
            We have sent and OTP verification code to you email, please enter it here
          </div>
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
          <Button type="button" variant="link" className="text-blue-900" onClick={handleNewOtp}>
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
