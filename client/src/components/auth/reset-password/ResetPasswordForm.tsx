import { StepItem, Stepper, validateStepFields } from '@/components/stepper/Stepper';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { OtpType } from '@/lib/enums/otp-type.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { userApi } from '@/store/reducers/user/userApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InputEmail } from './input-email/InputEmail';
import { InputOtp } from './input-otp/InputOtp';
import { InputPasswordWithConfirm } from './input-password/InputEmail';
import { ResetPasswordFormValues, resetPasswordDefaultValues, useResetPasswordFormSchema } from './validation';

export function ResetPasswordForm() {
  const [requestResetPassword] = userApi.useRequestResetPasswordMutation();
  const [confirmResetPassword] = userApi.useConfirmResetPasswordMutation();
  const [checkUserEmail] = userApi.useCheckUserEmailMutation();
  const [verifyOtp] = userApi.useVerifyOtpMutation();

  const navigate = useNavigate();

  const resetPasswordFormSchema = useResetPasswordFormSchema();

  const form = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: resetPasswordDefaultValues
  });

  const steps: StepItem[] = [
    {
      stepName: 'Input email',
      stepComponent: <InputEmail />,
      onNextClick: async (): Promise<boolean> => {
        const validationResult = await validateStepFields(form, ['email']);

        if (!validationResult) return false;

        const checkResult = await checkUserEmail({ email: form.getValues('email') })
          .unwrap()
          .then(({ userExist }) => {
            if (!userExist) {
              toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'User with this email does not exist. Please, check your email and try again.'
              });
            }

            return userExist;
          })
          .catch((error) => {
            handleRtkError(error);
            return false;
          });

        if (!checkResult) return false;

        const requestResetPasswordResult = await requestResetPassword({
          email: form.getValues('email'),
          type: OtpType.FORGOT_PASSWORD
        })
          .unwrap()
          .then(() => {
            return true;
          })
          .catch((error) => {
            handleRtkError(error);
            return false;
          });

        return validationResult && requestResetPasswordResult;
      }
    },
    {
      stepName: 'Input OTP code',
      stepComponent: <InputOtp />,
      onNextClick: async (): Promise<boolean> => {
        const validationResult = await validateStepFields(form, ['otpValue']);

        if (!validationResult) return false;

        const otpValidationResult = await verifyOtp({
          email: form.getValues('email'),
          otp: form.getValues('otpValue'),
          type: OtpType.FORGOT_PASSWORD
        })
          .unwrap()
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });

        return validationResult && otpValidationResult;
      }
    },
    {
      stepName: `Input password`,
      stepComponent: <InputPasswordWithConfirm />,
      onNextClick: async (): Promise<boolean> => {
        return !!(await validateStepFields(form, ['password', 'confirmPassword']));
      }
    }
  ];

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    await confirmResetPassword({
      password: data.password,
      email: data.email,
      type: OtpType.FORGOT_PASSWORD,
      otp: data.otpValue
    })
      .unwrap()
      .then(() => {
        navigate(AppRoute.General.SignIn);
      })
      .catch(handleRtkError);
  };

  const onBackClick = () => {
    navigate(AppRoute.General.SignIn);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6">
          <Stepper
            steps={steps}
            form={form}
            onSubmit={onSubmit}
            submitButtonText="Reset password"
            onBackClick={onBackClick}
          />
        </form>
      </Form>
    </>
  );
}
