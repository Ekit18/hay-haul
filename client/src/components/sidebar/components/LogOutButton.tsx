import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/routes';
import { useAppDispatch } from '@/lib/hooks/redux';
import { cn } from '@/lib/utils';
import { setAccessToken } from '@/store/reducers/token/tokenSlice';
import { logOut } from '@/store/reducers/user/userSlice';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LogOutButton({ className }: { className?: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="link"
      className={cn(
        'mb-5 mt-auto flex w-full flex-row items-center justify-start gap-5 px-3 text-left text-lg font-medium text-white decoration-2 hover:rounded-none xl:px-4',
        className
      )}
      onClick={() => {
        dispatch(setAccessToken(''));
        dispatch(logOut());
        navigate(AppRoute.General.SignIn);
      }}
      key="Logout"
    >
      <LogOut className="h-5 w-5 xl:h-6 xl:w-6" />
      Logout
    </Button>
  );
}
