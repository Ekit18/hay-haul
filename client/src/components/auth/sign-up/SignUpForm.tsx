import { Stepper } from '@/components/stepper/stepper';
import { Form } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChoseRole } from './chose-role/ChoseRole';
import { FarmerForm } from './farmer-form/FarmerForm';
import { MainInfo } from './main-info/MainInfo';
import { SignUpFormValues, defaultSignUpFormValues, useSignUpFormSchema } from './validation';

export function SignUpForm() {
  const signUpFormSchema = useSignUpFormSchema();

  const steps = [
    {
      stepName: 'Chose role',
      stepComponent: <ChoseRole />
    },
    {
      stepName: 'Enter your data',
      stepComponent: <MainInfo />
    },
    {
      stepName: 'Farm info',
      stepComponent: <FarmerForm />
    }
  ];

  const form = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpFormSchema),
    mode: 'onBlur',
    defaultValues: defaultSignUpFormValues
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6 mt-6 flex flex-col">
          <Stepper steps={steps} />
        </form>
      </Form>
    </>
  );
}
