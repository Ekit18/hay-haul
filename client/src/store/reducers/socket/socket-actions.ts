import { createAction } from '@reduxjs/toolkit';

import { SocketStatusValues } from '@/lib/types/Socket/socket-status-values.type.js';
// import { name as sliceName } from './socket.slice.js';

const setSocketStatus = createAction(`${'s'}/set-socket-status`, (status: SocketStatusValues) => {
  return { payload: status };
});

export { setSocketStatus };
