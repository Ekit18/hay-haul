import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from './api';

export const rootReducer = combineReducers({
  // teacherReducer,
  // productReducer,
  // cartReducer,
  // userReducer,
  // productReducer
  // checkOutReducer,
  // eslint-disable-next-line no-use-before-define
  // searchReducer
  // [groupApi.reducerPath]: groupApi.reducer,
  // [shopApi.reducerPath]: shopApi.reducer,
  // [orderApi.reducerPath]: orderApi.reducer,
  // [airportApi.reducerPath]: airportApi.reducer,
  // [flightApi.reducerPath]: flightApi.reducer
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
