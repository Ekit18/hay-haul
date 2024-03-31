import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './api';
import { socketSlice } from './reducers/socket/socket.slice';
import tokenReducer from './reducers/token/tokenSlice';
import { userApi } from './reducers/user/userApi';
import { userSlice } from './reducers/user/userSlice';

const persistAccessTokenConfig = {
  key: 'accessToken',
  storage,
  whitelist: ['accessToken']
};

const persistedAccessTokenReducer = persistReducer(persistAccessTokenConfig, tokenReducer);

export const rootReducer = combineReducers({
  accessToken: persistedAccessTokenReducer,
  // teacherReducer,
  // productReducer,
  // cartReducer,
  [userSlice.reducerPath]: userSlice.reducer,
  [socketSlice.reducerPath]: socketSlice.reducer,
  // productReducer
  // checkOutReducer,
  // eslint-disable-next-line no-use-before-define
  // searchReducer
  // [groupApi.reducerPath]: groupApi.reducer,
  // [shopApi.reducerPath]: shopApi.reducer,
  // [orderApi.reducerPath]: orderApi.reducer,
  // [airportApi.reducerPath]: airportApi.reducer,
  // [flightApi.reducerPath]: flightApi.reducer
  [userApi.reducerPath]: userApi.reducer
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      }).concat(api.middleware),
    devTools: true
  });
};

export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
