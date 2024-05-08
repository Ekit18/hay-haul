import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { OtpType } from '@/lib/enums/otp-type.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { userApi } from '@/store/reducers/user/userApi';
import { useFormContext } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import { toast } from '@/components/ui/use-toast';
import { ResetPasswordFormValues } from '../validation';

export function InputOtp() {
  const { control, getValues } = useFormContext<ResetPasswordFormValues>();
  const [newOtp] = userApi.useNewOtpMutation();

  const email = getValues('email');

  const handleNewOtp = async () => {
    await newOtp({ email, type: OtpType.FORGOT_PASSWORD })
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
    <div className="flex h-full w-full justify-center">
      <FormField
        control={control}
        name="otpValue"
        render={({ field }) => (
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              numInputs={4}
              renderSeparator={<span> </span>}
              renderInput={(props) => (
                <input name="otpValue" {...props} className="ml-4 border-b-2 text-3xl first:ml-0" />
              )}
            />
            <Button type="button" variant="link" className="text-blue-900" onClick={handleNewOtp}>
              Request New Code
            </Button>
          </div>
        )}
      />
    </div>
  );
}
