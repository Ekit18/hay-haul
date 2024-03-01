import { BaseQueryApi, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAccessToken } from './reducers/token/tokenSlice';
import { TokenResponse } from './reducers/user/userApi';
import { logOut } from './reducers/user/userSlice';
import { RootState } from './store';

const BASE_URL = import.meta.env.VITE_API_URL;

export type FetchError = FetchBaseQueryError & {
  data: {
    statusCode: number;
    error: string;
    message: string;
  };
};

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = getState() as RootState;
    const currentToken = accessToken.accessToken;

    if (currentToken) {
      headers.set('Authorization', `Bearer ${currentToken}`);
    }

    return headers;
  },
  credentials: 'include'
});

export const baseQueryWithReAuth = async (
  args: { url: string; method: string; body: unknown } | string,
  api: BaseQueryApi,
  extraOptions: NonNullable<unknown>
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);

    console.log('CHANGE');
    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data as TokenResponse;

      api.dispatch(setAccessToken(accessToken));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setAccessToken(''));
      api.dispatch(logOut());
    }
  }

  return result;
};

export const api = createApi({
  tagTypes: ['UserFlights'],
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({})
});
