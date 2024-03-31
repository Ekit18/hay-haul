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
  const [refresh, { isUninitialized: isRefreshingToken, isSuccess }] = userApi.useRefreshMutation();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!token) {
        return setLoading(false);
      }

      let user: UserToken | null = null;

      try {
        user = jwt_decode<UserToken>(token);

        if (user.exp * 1000 < Date.now()) {
          try {
            console.log(1);
            console.log('rerender');
            await refresh(undefined)
              .unwrap()
              .then(({ accessToken }) => {
                dispatch(setAccessToken(accessToken));
                user = jwt_decode<UserToken>(accessToken);
                socket.removeAllListeners();
                socket.connect(accessToken);
              });
          } catch (e) {
            handleRtkError(e);
          }
        } else {
          console.log(2);
          socket.removeAllListeners();
          socket.connect(token);
        }
      } catch (e) {
        console.log('error decoding token');
      }

      if (user) dispatch(setUser(user));

      setLoading(false);
    })();
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
