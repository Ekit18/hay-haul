import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks/redux';
import { notificationApi } from '@/store/reducers/notifications/notificationApi';

export function Notifications() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const { data: notifications } = notificationApi.useGetNotificationsQuery(user.id);

  const [markAllAsRead] = notificationApi.useUpdateNotificationToReadAllMutation();

  console.log(notifications);

  const handleMarkAllAsRead = () => {
    markAllAsRead(user.id);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <div className="bg-white p-4">
          <h2 className="mb-9 mt-6 text-3xl font-bold">Notifications</h2>
        </div>
        <div className="flex w-full justify-end pr-5">
          <Button onClick={handleMarkAllAsRead}>Mark all as read</Button>
        </div>
        <div className="w-full px-4">
          {notifications?.data.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
}
