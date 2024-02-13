import { FormField } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import { ResetPasswordFormValues } from '../validation';

export function InputOtp() {
  const { control } = useFormContext<ResetPasswordFormValues>();

  return (
    <div className="w-full h-full">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <OTPInput
            value={field.value}
            onChange={field.onChange}
            numInputs={4}
            renderSeparator={<span> </span>}
            renderInput={(props) => (
              <input name="otpValue" {...props} className="border-b-2 first:ml-0 ml-4 text-3xl" />
            )}
          />
        )}
      />
    </div>
  );
}
