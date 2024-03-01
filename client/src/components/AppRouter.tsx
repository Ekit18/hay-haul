import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { OtpConfirmPage } from '@/pages/OtpConfirmPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, farmerRoutes } from '../routes';
import { AuthLayout } from './layouts/AuthLayout';
import { SidebarLayout } from './layouts/SidebarLayout';

export function AppRouter() {
  const user = useAppSelector((state) => state.user.user);
  // GOVNOKOD
  return (
    <Routes>
      {!user && authRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}

      {user?.isVerified === false ? (
        <Route>
          <Route path={AppRoute.General.OtpConfirm} element={<OtpConfirmPage />} />
          <Route path="*" element={<Navigate to={AppRoute.General.OtpConfirm} replace />} />
        </Route>
      ) : (
        <Route element={<SidebarLayout />}>
          <Route element={<AuthLayout allowedRoles={[UserRole.Farmer]} />}>
            {farmerRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
          <Route path="*" element={<Navigate to={AppRoute.General.Main} replace />} />
        </Route>
      )}
      <Route path="*" element={<Navigate to={AppRoute.General.SignIn} replace />} />
    </Routes>
  );
}
