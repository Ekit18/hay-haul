import { User } from '@/lib/types/User/User.type';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload: user }: PayloadAction<User>) => {
      state.user = user;
    },
    logOut: (state) => {
      state.user = null;
    }
  }
});

export const { logOut, setUser } = userSlice.actions;
