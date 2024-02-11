import { FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL;

export type FetchError = FetchBaseQueryError & {
  data: {
    statusCode: number;
    error: string;
    message: string;
  };
};

export const api = createApi({
  tagTypes: ['UserFlights'],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    }
  }),
  endpoints: () => ({})
});
