import { StepItem, Stepper } from '@/components/stepper/stepper';
import { Form } from '@/components/ui/form';
import { MAIN_ROUTE } from '@/lib/constants/routes';
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

  const signUpFormSchema = useSignUpFormSchema();

  const form = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpFormSchema),
    mode: 'onBlur',
    defaultValues: defaultSignUpFormValues
  });

  const selectedRole = form.watch('role');

  const steps: StepItem<keyof SignUpFormValues>[] = [
    {
      stepName: 'Chose role',
      stepComponent: <ChoseRole />,
      fieldsToValidate: ['role']
    },
    {
      stepName: 'Your data',
      stepComponent: <MainInfo />,
      fieldsToValidate: ['email', 'password', 'fullName', 'role']
    },
    {
      stepName: `${roleDetails[selectedRole as RegisterableRoles].name as string} info`,
      stepComponent: <FacilityForm />,
      fieldsToValidate: [
        'facilityName',
        'facilityAddress',
        'facilityOfficialCode',
        ...(selectedRole === UserRole.Farmer ? (['farmProductTypes'] as (keyof SignUpFormValues)[]) : [])
      ]
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
      .then(() => navigate(MAIN_ROUTE))
      .catch(handleRtkError);
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
