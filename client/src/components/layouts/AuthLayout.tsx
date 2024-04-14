import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function AuthLayout({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation();

  if (!user) return <Navigate to={AppRoute.General.SignIn} state={{ from: location }} replace />;

  if (!user.isVerified) return <Navigate to={AppRoute.General.OtpConfirm} state={{ from: location }} replace />;

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  }
  console.log('//////');
  return null;
}
