import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { useAppDispatch, useAppSelector } from './lib/hooks/redux';
import { cn } from './lib/utils';
import { setUser } from './store/reducers/user/userSlice';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { handleRtkError } from './lib/helpers/handleRtkError';
import { socket } from './lib/helpers/socketService';
import { UserToken } from './lib/types/User/User.type';
import { setAccessToken } from './store/reducers/token/tokenSlice';
import { userApi } from './store/reducers/user/userApi';

function App() {
  const token = useAppSelector((state) => state.accessToken.accessToken);
  const dispatch = useAppDispatch();
  const [refresh] = userApi.useRefreshMutation();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) {
      return setIsLoading(false);
    }

    try {
      const user = jwt_decode<UserToken>(token);

      if (user.exp * 1000 < Date.now()) {
        try {
          refresh(undefined)
            .unwrap()
            .then(({ accessToken }) => {
              dispatch(setAccessToken(accessToken));
              const user = jwt_decode<UserToken>(accessToken);

              if (user) dispatch(setUser(user));
              socket.removeAllListeners();
              socket.connect(accessToken);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } catch (e) {
          handleRtkError(e);
        }
      } else {
        if (user) dispatch(setUser(user));

        socket.removeAllListeners();
        socket.connect(token);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      console.log('error decoding token');
    }
  }, [dispatch, token]);

  if (isLoading) {
    return <Loader2 className={cn('mr-2 hidden h-4 w-4 animate-spin')} />;
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
