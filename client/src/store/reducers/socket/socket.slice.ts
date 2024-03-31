import { SocketStatus } from '@/lib/enums/socket-status.enum';
import { SocketStatusValues } from '@/lib/types/Socket/socket-status-values.type';
import { createSlice } from '@reduxjs/toolkit';
import { setSocketStatus } from './socket-actions';

type State = {
  socketStatus: SocketStatusValues;
};

const initialState: State = {
  socketStatus: SocketStatus.DISCONNECTED
};

export const socketSlice = createSlice({
  initialState,
  name: 'socket',
  reducers: {},
  extraReducers(builder) {
    builder.addCase(setSocketStatus, (state, action) => {
      state.socketStatus = action.payload;
    });
  }
});
