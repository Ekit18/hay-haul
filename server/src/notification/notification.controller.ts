import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { NotificationService } from './notification.service';
import {
  NotificationsListResponse,
  UnreadNotificationsResponse,
} from './types/notification.type';

@ApiTags('Notifications')
@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/:userId')
  getNotificationsHistory(
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<NotificationsListResponse> {
    return this.notificationService.getNotifications(userId, req);
  }

  @Get('/unread/:userId')
  getUnreadNotifications(
    @Param('userId') userId: string,
  ): Promise<UnreadNotificationsResponse> {
    return this.notificationService.getUnreadNotifications(userId);
  }

  @Patch('/unread/:userId')
  updateNotificationsToRead(@Param('userId') userId: string) {
    return this.notificationService.updateNotificationsToRead(userId);
  }

  @Patch('/unread-notification/:notificationId')
  updateNotificationToRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.updateNotificationToRead(notificationId);
  }
}
