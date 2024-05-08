import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { OtpType } from '@/lib/enums/otp-type.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { User } from '@/lib/types/User/User.type';
import { setAccessToken } from '@/store/reducers/token/tokenSlice';
import { userApi } from '@/store/reducers/user/userApi';
import { setUser } from '@/store/reducers/user/userSlice';
import { yupResolver } from '@hookform/resolvers/yup';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { SubmitHandler, useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { OtpFormValues, otpDefaultValues, useOtpFormSchema } from './validation';
import { toast } from '@/components/ui/use-toast';

interface OtpFormProps {
  onSetIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export function OtpForm({ onSetIsSuccess }: OtpFormProps) {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user as User);

  const [verifyOtp] = userApi.useVerifyOtpMutation();
  const [newOtp] = userApi.useNewOtpMutation();

  const otpFormSchema = useOtpFormSchema();
  const form = useForm<OtpFormValues>({
    mode: 'onBlur',
    defaultValues: otpDefaultValues,
    resolver: yupResolver(otpFormSchema)
  });

  const onSubmit: SubmitHandler<OtpFormValues> = async (data) => {
    await verifyOtp({ otp: data.otpValue, userId: user.id, type: OtpType.REGISTER })
      .unwrap()
      .then((data) => {
        if (!data) return;
        const { accessToken } = data;
        const user = jwt_decode<User>(accessToken);

        dispatch(setUser(user));

        dispatch(setAccessToken(accessToken));
        onSetIsSuccess(true);
      })
      .catch(handleRtkError);
  };

  const handleNewOtp = async () => {
    await newOtp({ userId: user.id, type: OtpType.REGISTER })
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'New OTP sent',
          description: 'We have sent a new OTP to your email.'
        });
      })
      .catch(handleRtkError);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center justify-center gap-10"
        >
          <div className="text-center text-base font-medium ">
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
                      <input name="otpValue" {...props} className="ml-4 border-b-2 text-3xl first:ml-0" />
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
