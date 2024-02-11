import { MAIN_ROUTE } from '@/lib/constants/routes';
import { Navigate, Route, Routes } from 'react-router-dom';
import { publicRoutes } from '../routes';

export function AppRouter() {
  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to={MAIN_ROUTE} replace />} />
    </Routes>
  );
}
