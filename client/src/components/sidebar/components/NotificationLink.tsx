import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/routes';
import { useAppSelector } from '@/lib/hooks/redux';
import { Notification } from '@/lib/types/Notifications/Notifications.type';
import { notificationApi } from '@/store/reducers/notifications/notificationApi';
import { Bell } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export function NotificationLink() {
  const user = useAppSelector((state) => state.user.user);
  if (!user) return null;

  const navigate = useNavigate();

  const { data } = notificationApi.useGetNotificationsQuery(user.id);

  const unreadNotifications: Notification[] = useMemo(() => {
    return data?.data.filter((notification) => notification.isRead === false) || [];
  }, [data]);

  return (
    <Button
      variant="link"
      className=" flex w-full flex-row items-center justify-start gap-5 px-3 text-left text-lg font-medium text-white decoration-2 hover:rounded-none xl:px-4"
      onClick={() => navigate(AppRoute.General.Notifications)}
    >
      <div className="relative">
        <Bell className="h-5 w-5" />
        {unreadNotifications.length > 0 && (
          <div className="absolute -top-2 left-3 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-[2px]  text-xs">
            {unreadNotifications?.length}
          </div>
        )}
      </div>
      Notifications
    </Button>
  );
}
