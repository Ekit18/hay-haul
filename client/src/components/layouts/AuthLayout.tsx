import { AppRoute } from '@/lib/constants/routes';
import { RegisterableRoles } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { selectUser } from '@/store/reducers/user/userSlice';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function AuthLayout({ allowedRoles }: { allowedRoles: RegisterableRoles[] }) {
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!user) return <Navigate to={AppRoute.General.SignIn} state={{ from: location }} replace />;

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  return <Navigate to={AppRoute.General.Main} state={{ from: location }} replace />;
}
