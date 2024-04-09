import { createAction } from '@reduxjs/toolkit';

import { SocketStatusValues } from '@/lib/types/Socket/socket-status-values.type.js';
import { socketSlice } from './socket.slice.js';

const setSocketStatus = createAction(`${socketSlice.name}/set-socket-status`, (status: SocketStatusValues) => {
  return { payload: status };
});

export { setSocketStatus };
