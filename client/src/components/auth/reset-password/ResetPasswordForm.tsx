import { StepItem, Stepper } from '@/components/stepper/stepper';
import { Form } from '@/components/ui/form';
import { userApi } from '@/store/reducers/user/userApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputEmail } from './input-email/InputEmail';
import { InputOtp } from './input-otp/InputOtp';
import { InputPasswordWithConfirm } from './input-password/InputEmail';
import { ResetPasswordFormValues, resetPasswordDefaultValues, useResetPasswordFormSchema } from './validation';

export function ResetPasswordForm() {
  const [createNewOtp, result] = userApi.useNewOtpMutation();

  const resetPasswordFormSchema = useResetPasswordFormSchema();

  const form = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: resetPasswordDefaultValues
  });

  const steps: StepItem<keyof ResetPasswordFormValues>[] = [
    {
      stepName: 'Input email',
      stepComponent: <InputEmail />,
      fieldsToValidate: ['email']
    },
    {
      stepName: 'Input OTP code',
      stepComponent: <InputOtp />,
      fieldsToValidate: ['otpValue']
    },
    {
      stepName: `Input password`,
      stepComponent: <InputPasswordWithConfirm />,
      fieldsToValidate: ['password', 'confirmPassword']
    }
  ];

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
