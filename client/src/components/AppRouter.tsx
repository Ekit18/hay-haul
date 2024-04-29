import { AppRoute, roleToMainRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { OtpConfirmPage } from '@/pages/OtpConfirmPage';
import { StripeRefreshPage } from '@/pages/StripeRefreshPage';
import { StripeRegisterPage } from '@/pages/StripeRegisterPage';
import { StripeReturnPage } from '@/pages/StripeReturnPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, businessRoutes, carrierRoutes, driverRoutes, farmerRoutes, generalRoutes } from '../routes';
import { AuthLayout } from './layouts/AuthLayout';
import { SidebarLayout } from './layouts/SidebarLayout';

const roleToRoutes = {
  [UserRole.Farmer]: farmerRoutes,
  [UserRole.Businessman]: businessRoutes,
  [UserRole.Carrier]: carrierRoutes,
  [UserRole.Driver]: driverRoutes
};

export function AppRouter() {
  const user = useAppSelector((state) => state.user.user);

  let routes = (
    <Route element={<SidebarLayout />}>
      {user?.role && (
        <Route element={<AuthLayout allowedRoles={[user.role]} />}>
          {roleToRoutes[user.role].map(({ path, Component }) => {
            return <Route key={path + user.role} path={path} element={<Component />} />;
          })}
        </Route>
      )}
      {/* <Route element={<AuthLayout allowedRoles={[UserRole.Farmer]} />}>
        {farmerRoutes.map(({ path, Component }) => {
          console.log('aaaaaaaaaaaa');
          return <Route key={path + UserRole.Farmer} path={path} element={<Component />} />;
        })}
      </Route>
      <Route element={<AuthLayout allowedRoles={[UserRole.Businessman]} />}>
        {businessRoutes.map(({ path, Component }) => {
          return <Route key={path + UserRole.Businessman} path={path} element={<Component />} />;
        })}
      </Route>
      <Route element={<AuthLayout allowedRoles={[UserRole.Carrier]} />}>
        {carrierRoutes.map(({ path, Component }) => (
          <Route key={path + UserRole.Businessman} path={path} element={<Component />} />
        ))} */}
      {/* </Route> */}
      {/* TODO: Remake the logic of general rotes so, for example only farmer and businessman can access auction route */}
      <Route element={<AuthLayout allowedRoles={Object.values(UserRole)} />}>
        {generalRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={roleToMainRoute[user?.role as UserRole]} replace />} />
    </Route>
  );
  if (user?.role && [UserRole.Farmer, UserRole.Carrier].includes(user.role) && !user?.payoutsEnabled) {
    routes = (
      <Route>
        <Route path={AppRoute.General.StripeRegister} element={<StripeRegisterPage />} />
        <Route path={AppRoute.General.StripeRefresh} element={<StripeRefreshPage />} />
        <Route path={AppRoute.General.StripeReturn} element={<StripeReturnPage />} />
        <Route path="*" element={<Navigate to={AppRoute.General.StripeRegister} replace />} />
      </Route>
    );
  } else if (user?.isVerified === false) {
    routes = (
      <Route>
        <Route path={AppRoute.General.OtpConfirm} element={<OtpConfirmPage />} />
        <Route path="*" element={<Navigate to={AppRoute.General.OtpConfirm} replace />} />
      </Route>
    );
  }
  return (
    <Routes>
      {!user && authRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
      {user && routes}
      <Route path="*" element={<Navigate to={AppRoute.General.SignIn} replace />} />
    </Routes>
  );
}
