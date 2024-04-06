import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Notification } from '@/lib/types/Notifications/Notifications.type';
import { MoreHorizontal } from 'lucide-react';
import { notificationMessages } from './constants';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const notificationMessage = notificationMessages[notification.message];

  const handleMarkIsReadClick = () => {};
  const handleViewAuctionClick = () => {};

  return (
    <>
      <div className="flex items-center">
        <div className="">
          <notificationMessage.icon />
        </div>
        <div className="flex items-center border-b-2 border-gray-200">
          <div className="">
            <p>{notificationMessage.message}</p>
          </div>
          <div className="">
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
          <div className="">
            <div className="size-2 rounded-full bg-primary"></div>
          </div>
        </div>
      </div>
    </>
  );
}
