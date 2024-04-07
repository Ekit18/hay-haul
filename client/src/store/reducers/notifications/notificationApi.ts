import { notificationMessages } from '@/components/notifications/constants';
import { toast } from '@/components/ui/use-toast';
import { ServerToClientEventName } from '@/lib/enums/server-to-client-event-name.enum';
import { socket } from '@/lib/helpers/socketService';
import { Notification } from '@/lib/types/Notifications/Notifications.type';
import { DataWithCount } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { QueryCacheLifecycleApi } from 'node_modules/@reduxjs/toolkit/dist/query/endpointDefinitions';
import { generatePath } from 'react-router-dom';

export type UnreadNotification = {
  data: Notification[];
  count: number;
};

export interface NotificationResponse {
  data: Notification[];
  count: number;
}

async function onNotificationCacheEntryAdded(
  arg: string,
  {
    updateCachedData,
    cacheDataLoaded,
    cacheEntryRemoved
  }: QueryCacheLifecycleApi<string, BaseQueryFn, DataWithCount<Notification>, 'api'>
) {
  try {
    await cacheDataLoaded;

    socket.addListener(ServerToClientEventName.Notification, (notification) => {
      toast({
        variant: 'default',
        title: 'Notification',
        description: notificationMessages[notification.message].message
      });
      updateCachedData((draft) => {
        draft.data.unshift(notification);
      });
    });
  } catch (e) {
    console.log(e);
  }

  await cacheEntryRemoved;
  socket.removeAllListeners(ServerToClientEventName.Notification);
}

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationResponse, string>({
      query: (userId) => ({ url: generatePath(`/notification/:userId`, { userId }) }),
      providesTags: [TagType.Notification],
      onCacheEntryAdded: onNotificationCacheEntryAdded
    }),
    updateNotificationToRead: builder.mutation<Notification, string>({
      query: (notificationId) => ({
        url: generatePath(`/notification/unread-notification/:notificationId`, { notificationId }),
        method: 'PATCH'
      }),
      invalidatesTags: [TagType.Notification]
    }),
    updateNotificationToReadAll: builder.mutation<Notification, string>({
      query: (userId) => ({
        url: generatePath(`/notification/unread/:userId`, { userId }),
        method: 'PATCH'
      }),
      invalidatesTags: [TagType.Notification]
    })
  })
});
