import { User } from '@/lib/types/User/User.type';
import { RootState } from '@/store/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: null
};

const userSlice = createSlice({
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

export const selectUser = (state: RootState): UserState['user'] => state.userReducer.user;

export default userSlice.reducer;
