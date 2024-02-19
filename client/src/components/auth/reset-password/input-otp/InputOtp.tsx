import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { OtpType } from '@/lib/enums/otp-type.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { userApi } from '@/store/reducers/user/userApi';
import { useFormContext } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import { ResetPasswordFormValues } from '../validation';

export function InputOtp() {
  const { control, getValues } = useFormContext<ResetPasswordFormValues>();
  const [newOtp] = userApi.useNewOtpMutation();

  const email = getValues('email');

  const handleNewOtp = async () => {
    await newOtp({ email, type: OtpType.FORGOT_PASSWORD }).unwrap().catch(handleRtkError);
  };

  return (
    <div className="w-full h-full flex justify-center">
      <FormField
        control={control}
        name="otpValue"
        render={({ field }) => (
          <div className="w-full flex flex-col justify-center items-center gap-5">
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              numInputs={4}
              renderSeparator={<span> </span>}
              renderInput={(props) => (
                <input name="otpValue" {...props} className="border-b-2 first:ml-0 ml-4 text-3xl" />
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
