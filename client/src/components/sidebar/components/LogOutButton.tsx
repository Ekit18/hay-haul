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
        'w-full text-left hover:rounded-none justify-start text-white font-medium text-lg flex flex-row items-center gap-5 decoration-2 mt-auto mb-5',
        className
      )}
      onClick={() => {
        dispatch(setAccessToken(''));
        dispatch(logOut());
        navigate(AppRoute.General.SignIn);
      }}
      key="Logout"
    >
      <LogOut />
      Logout
    </Button>
  );
}
