import { StepItem, Stepper, validateStepFields } from '@/components/stepper/Stepper';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { RegisterableRoles, UserRole } from '@/lib/enums/user-role.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppDispatch } from '@/lib/hooks/redux';
import { User } from '@/lib/types/User/User.type';
import { setAccessToken } from '@/store/reducers/token/tokenSlice';
import { userApi } from '@/store/reducers/user/userApi';
import { setUser } from '@/store/reducers/user/userSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ChoseRole } from './chose-role/ChoseRole';
import { FacilityForm } from './facility-form/FacilityForm';
import { MainInfo } from './main-info/MainInfo';
import { SignUpFormValues, defaultSignUpFormValues, useSignUpFormSchema } from './validation';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

const roleDetails: {
  [K in RegisterableRoles]: { name: string };
} = {
  [UserRole.Farmer]: { name: 'Farm' },
  [UserRole.Businessman]: { name: 'Business' },
  [UserRole.Carrier]: { name: 'Carrier' }
};

export function SignUpForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [registration] = userApi.useRegistrationMutation();
  const [checkUserEmail] = userApi.useCheckUserEmailMutation();

  const signUpFormSchema = useSignUpFormSchema();

  const form = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpFormSchema),
    mode: 'onBlur',
    defaultValues: defaultSignUpFormValues
  });

  const selectedRole = form.watch('role');

  const steps: StepItem[] = [
    {
      stepName: 'Chose role',
      stepComponent: <ChoseRole />,
      onNextClick: async (): Promise<boolean> => {
        const result = await validateStepFields(form, ['role']);
        return result;
      }
    },
    {
      stepName: 'Your data',
      stepComponent: <MainInfo />,
      onNextClick: async (): Promise<boolean> => {
        const validationResult = await validateStepFields(form, ['email', 'password', 'fullName', 'role']);

        if (!validationResult) return false;

        const checkResult = await checkUserEmail({ email: form.getValues('email') })
          .unwrap()
          .then(({ userExist }) => {
            if (!userExist) return true;

            toast({
              variant: 'destructive',
              title: 'Something went wrong',
              description: 'User with this email already exists. Please, try another email.'
            });

            return false;
          })
          .catch((error) => {
            handleRtkError(error);
            return false;
          });

        return validationResult && checkResult;
      }
    },
    {
      stepName: `${roleDetails[selectedRole as RegisterableRoles].name as string} info`,
      stepComponent: <FacilityForm />,
      onNextClick: async (): Promise<boolean> => {
        const result = await validateStepFields(form, [
          'facilityName',
          'facilityAddress',
          'facilityOfficialCode',
          ...(selectedRole === UserRole.Farmer ? (['facilityProductTypes'] as (keyof SignUpFormValues)[]) : [])
        ]);

        return result;
      }
    }
  ];

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    await registration(data)
      .unwrap()
      .then(({ accessToken }) => {
        const user = jwt_decode<User>(accessToken);

        dispatch(setUser(user));

        dispatch(setAccessToken(accessToken));
      })
      .then(() => navigate(AppRoute.General.OtpConfirm))
      .catch((e) => {
        handleRtkError(e);
      });
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
            submitButtonText="Register"
            onBackClick={onBackClick}
          />
        </form>
      </Form>
    </>
  );
}
