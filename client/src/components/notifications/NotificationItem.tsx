import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AppRoute } from '@/lib/constants/routes';
import { Notification } from '@/lib/types/Notifications/Notifications.type';
import { notificationApi } from '@/store/reducers/notifications/notificationApi';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { generatePath, useNavigate } from 'react-router-dom';
import { notificationMessages } from './constants';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const notificationMessage = notificationMessages[notification.message];
  const navigate = useNavigate();

  const [setNotificationToRead] = notificationApi.useUpdateNotificationToReadMutation();

  const handleMarkIsReadClick = () => {
    setNotificationToRead(notification.id);
  };
  const handleViewAuctionClick = () => {
    navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: notification.productAuctionId }));
  };

  return (
    <>
      <div className="flex w-full flex-row items-center gap-5">
        <div className="">
          <notificationMessage.icon />
        </div>
        <div className="flex w-full flex-row items-center border-b-2 border-gray-200">
          <div className="flex w-10/12 flex-row gap-2">
            <p className="font-medium">{format(new Date(notification.createdAt), 'dd-MM-yyyy HH:mm:ss')}</p>
            <p>{notificationMessage.message}</p>
          </div>
          <div className="flex w-1/12 items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem disabled={notification.isRead} onClick={handleMarkIsReadClick}>
                  Mark as read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleViewAuctionClick}>Show auction</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {!notification.isRead && (
            <div className="flex w-1/12 items-center justify-center">
              <div className="size-2 rounded-full bg-primary" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
