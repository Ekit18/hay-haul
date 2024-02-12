import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const accessTokenSlice = createSlice({
  name: 'token',
  initialState: {
    accessToken: ''
  },
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    removeAccessToken(state) {
      state.accessToken = '';
    }
  }
});

export const { setAccessToken, removeAccessToken } = accessTokenSlice.actions;

export default accessTokenSlice.reducer;
