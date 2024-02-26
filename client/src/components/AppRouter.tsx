import { AppRoute } from '@/lib/constants/routes';
import { useAppSelector } from '@/lib/hooks/redux';
import { selectUser } from '@/store/reducers/user/userSlice';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { SidebarLayout } from './layouts/SidebarLayout';

export function AppRouter() {
  const user = useAppSelector(selectUser);
  return (
    <Routes>
      {!user && authRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
      <Route element={<SidebarLayout />}>
        {publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        {/* <Route element={<AuthLayout allowedRoles={[UserRole.Farmer]} />}>
          {
            // farmerRoutes.map(({path,Component})=>(
            // <Route key={path} path={path} element={<Component />} />
            // ))
          }
        </Route>
        <Route element={<AuthLayout allowedRoles={[UserRole.Farmer, UserRole.Businessman]} />}>
          {
            // farmerBusinessRoutes.map(({path,Component})=>(
            // <Route key={path} path={path} element={<Component />} />
            // ))
          }
        </Route> */}
      </Route>
      <Route path="*" element={<Navigate to={AppRoute.General.Main} replace />} />
    </Routes>
  );
}
