import { StepItem, Stepper } from '@/components/stepper/stepper';
import { Form } from '@/components/ui/form';
import { OtpDataType } from '@/lib/enums/otp-data-type.enum';
import { OtpType } from '@/lib/enums/otp-type.enum';
import { useNewOtpMutation } from '@/store/reducers/user/userApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputEmail } from './input-email/InputEmail';
import { InputOtp } from './input-otp/InputOtp';
import { InputPasswordWithConfirm } from './input-password/InputEmail';
import { ResetPasswordFormValues, resetPasswordDefaultValues, useResetPasswordFormSchema } from './validation';

export function ResetPasswordForm() {
  const resetPasswordFormSchema = useResetPasswordFormSchema();
  const [createNewOtp, result] = useNewOtpMutation();

  const form = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordFormSchema),
    mode: 'onBlur',
    defaultValues: resetPasswordDefaultValues
  });

  const steps: StepItem<keyof ResetPasswordFormValues>[] = [
    {
      stepName: 'Input email',
      stepComponent: <InputEmail />,
      fieldsToValidate: ['email']
    },
    {
      stepName: 'Input verification code',
      stepComponent: <InputOtp />,
      fieldsToValidate: ['otpValue']
    },
    {
      stepName: `Input new password`,
      stepComponent: <InputPasswordWithConfirm />,
      fieldsToValidate: ['password', 'confirmPassword']
    }
  ];

  const email = form.watch('email');

  useEffect(() => {
    if (!form.getFieldState('email').error) {
      const { email } = form.getValues();
      createNewOtp({ userData: email, type: OtpType.FORGOT_PASSWORD, dataType: OtpDataType.EMAIL });
    }
  }, [email]);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6 mt-6 flex flex-col">
          <Stepper steps={steps} form={form} onSubmit={onSubmit} />
        </form>
      </Form>
    </>
  );
}
