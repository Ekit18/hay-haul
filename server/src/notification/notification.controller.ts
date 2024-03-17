import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiPath } from 'src/common/enums/api-path.enum';
import { ErrorMessage } from 'src/common/enums/error-message.enum';
import { TokenGuard } from 'src/modules/auth/middleware/auth.middleware';

import { NOTIFICATION_HISTORY_EXAMPLE } from './constants/notification.constants';
import { NotificationApiPath } from './enums/notification.api-path.enum';
import { NotificationService } from './notification.service';
import {
  UnreadNotificationsResponse,
  NotificationsListResponse,
} from './types/notification.type';

@ApiTags('Notifications')
@Controller(ApiPath.Notifications)
@UseGuards(TokenGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: "Get all user's notifications" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification were sent successfully',
    schema: {
      example: NOTIFICATION_HISTORY_EXAMPLE,
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessage.UserIsNotAuthorized,
  })
  @Get(NotificationApiPath.UserId)
  getNotificationsHistory(
    @Param('userId') userId: string,
  ): Promise<NotificationsListResponse> {
    return this.notificationService.getNotifications(userId);
  }

  @ApiOperation({ summary: 'Get all unread notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification were sent successfully',
    schema: {
      example: { data: NOTIFICATION_HISTORY_EXAMPLE, count: 2 },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessage.UserIsNotAuthorized,
  })
  @Get(NotificationApiPath.Unread)
  getUnreadNotifications(
    @Param('userId') userId: string,
  ): Promise<UnreadNotificationsResponse> {
    return this.notificationService.getUnreadNotifications(userId);
  }

  @ApiOperation({ summary: 'Update all notifications to isRead' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notifications updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessage.UserIsNotAuthorized,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ErrorMessage.InternalServerError,
  })
  @Patch(NotificationApiPath.Unread)
  updateNotificationsToRead(@Param('userId') userId: string): Promise<void> {
    return this.notificationService.updateNotificationsToRead(userId);
  }
}
