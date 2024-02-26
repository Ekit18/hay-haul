import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { useAppDispatch, useAppSelector } from './lib/hooks/redux';
import { cn } from './lib/utils';
import { setUser } from './store/reducers/user/userSlice';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { User } from './lib/types/User/User.type';

function App() {
  const token = useAppSelector((state) => state.accessToken.accessToken);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) {
      return setLoading(false);
    }

    const user = jwt_decode<User>(token);

    dispatch(setUser(user));

    setLoading(false);
  }, [dispatch, token]);

  if (loading) {
    return <Loader2 className={cn('mr-2 hidden h-4 w-4 animate-spin')} />;
  }

  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
