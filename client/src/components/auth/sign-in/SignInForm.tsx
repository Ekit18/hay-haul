import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppDispatch } from '@/lib/hooks/redux';
import { User } from '@/lib/types/User/User.type';
import { cn } from '@/lib/utils';
import { setAccessToken } from '@/store/reducers/token/tokenSlice';
import { userApi } from '@/store/reducers/user/userApi';
import { setUser } from '@/store/reducers/user/userSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SignInFormValues, defaultSignInFormValues, useSignInFormSchema } from './validation';
// eslint-disable-next-line camelcase
import { AppRoute } from '@/lib/constants/routes';
import jwt_decode from 'jwt-decode';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SignInForm() {
  const dispatch = useAppDispatch();
  const signInFormSchema = useSignInFormSchema();
  const navigate = useNavigate();

  const [login, { isLoading: loginIsLoading }] = userApi.useLoginMutation();

  const form = useForm<SignInFormValues>({
    resolver: yupResolver(signInFormSchema),
    mode: 'onBlur',
    defaultValues: defaultSignInFormValues
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    await login(data)
      .unwrap()
      .then(({ accessToken }) => {
        const user = jwt_decode<User>(accessToken);

        dispatch(setUser(user));

        dispatch(setAccessToken(accessToken));
      })
      .then(() => navigate(AppRoute.General.Main))
      .catch(handleRtkError);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter you password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full hover:bg-secondary"
            disabled={!form.formState.isValid || loginIsLoading}
          >
            <Loader2 className={cn('mr-2 hidden h-4 w-4 animate-spin', loginIsLoading && 'block')} />
            Sign in
          </Button>
        </form>
      </Form>
    </>
  );
}
