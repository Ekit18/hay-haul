import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './api';
import tokenReducer from './reducers/token/tokenSlice';
import { userApi } from './reducers/user/userApi';
import userReducer from './reducers/user/userSlice';

const persistTokenConfig = {
  key: 'token',
  storage,
  whitelist: ['token']
};

const persistedTokenReducer = persistReducer(persistTokenConfig, tokenReducer);

export const rootReducer = combineReducers({
  token: persistedTokenReducer,
  // teacherReducer,
  // productReducer,
  // cartReducer,
  userReducer,
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
