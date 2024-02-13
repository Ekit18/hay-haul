import { StepItem, Stepper } from '@/components/stepper/stepper';
import { Form } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputEmail } from './input-email/InputEmail';
import { ResetPasswordFormValues, resetPasswordDefaultValues, useResetPasswordFormSchema } from './validation';

{
  /* <OtpInput
value={field.value}
onChange={field.onChange}
numInputs={4}
renderSeparator={<span> </span>}
renderInput={(props) => (
  <input name="otpValue" {...props} className="border-b-2 first:ml-0 ml-4 text-3xl" />
)}
/> */
}
//ок
export function SignUpForm() {
  const resetPasswordFormSchema = useResetPasswordFormSchema();

  const form = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordFormSchema),
    mode: 'onBlur',
    defaultValues: resetPasswordDefaultValues
  });

  const selectedRole = form.watch('role');

  const steps: StepItem<keyof ResetPasswordFormValues>[] = [
    {
      stepName: 'Input email',
      stepComponent: <InputEmail />,
      fieldsToValidate: ['email']
    },
    {
      stepName: 'Input verification code',
      //TODO: use code input component
      stepComponent: <MainInfo />,
      fieldsToValidate: ['otpValue']
    },
    {
      stepName: `Input new password`,
      stepComponent: <FacilityForm />,
      fieldsToValidate: ['password', 'confirmPassword']
    }
  ];

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6 mt-6 flex flex-col">
          <Stepper steps={steps} form={form} onSubmit={} />
        </form>
      </Form>
    </>
  );
}
