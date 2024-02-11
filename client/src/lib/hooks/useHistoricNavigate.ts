import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VisitedRoute } from '../types/Route/VisitedRoute';

const getCurrentTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return `${currentHour}:${currentMinute}`;
};

const useHistoricNavigate = () => {
  const libraryNavigate = useNavigate();
  const location = useLocation();

  const [visitedRoutes, setVisitedRoutes] = useState<VisitedRoute[]>([]);

  useEffect(() => {
    setVisitedRoutes((prevRoutes) => [...prevRoutes, { path: location.pathname, visitedAt: getCurrentTime() }]);
  }, [location]);

  const navigate = (route: string) => {
    libraryNavigate(route);
  };

  const onLinkClick = (route: string) => {
    setVisitedRoutes((prevRoutes) => [...prevRoutes, { path: route, visitedAt: getCurrentTime() }]);
  };

  return {
    navigate,
    onLinkClick,
    visitedRoutes
  };
};

export default useHistoricNavigate;
