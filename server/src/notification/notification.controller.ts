import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
  ): Promise<NotificationsListResponse> {
    return this.notificationService.getNotifications(userId);
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
}
