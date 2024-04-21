import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerEventName } from 'src/lib/enums/enums';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { SocketService } from 'src/socket/socket.service';
import { EntityManager, Repository } from 'typeorm';
import { NotificationErrorMessage } from './enums/notification-error-message.enum';
import { NotificationMessage } from './enums/notification-message.enum';
import { Notification } from './notification.entity';
import {
  NotificationsListResponse,
  UnreadNotificationsResponse,
} from './types/notification.type';
import { Notifiable } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly socketService: SocketService,
  ) { }

  async getNotifications(
    userId: string,
    req: AuthenticatedRequest,
  ): Promise<NotificationsListResponse> {
    const requestUserId = req.user.id;

    if (requestUserId !== userId) {
      throw new HttpException(
        NotificationErrorMessage.Unauthorized,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [data, count] = await this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin('notification.receiver', 'receiver')
      .where('receiver.id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getManyAndCount();

    return { data, count };
  }

  public async createNotification(
    userId: string,
    notifiableId: string,
    message: NotificationMessage,
    type: Notifiable,
    transactionalEntityManager?: EntityManager,
  ): Promise<void> {
    let notification;

    if (transactionalEntityManager) {
      notification = await transactionalEntityManager.save(Notification, {
        message,
        isRead: false,
        receiverId: userId,
        notifiableId,
      });
    } else {
      notification = await this.notificationRepository.save({
        message,
        isRead: false,
        receiverId: userId,
        notifiableId,
      });
    }

    SocketService.SocketServer.to(userId).emit(
      ServerEventName.Notification,
      notification,
    );
  }

  public async getUnreadNotifications(
    userId: string,
  ): Promise<UnreadNotificationsResponse> {
    const unreadNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .select([
        'notification.id AS id',
        'productAuction.id AS productAuctionId',
        'notification.message AS status',
        `CONCAT(sender.firstName, ' ', sender.lastName) AS user`,
      ])
      .innerJoin('notification.receiver', 'receiver')
      .innerJoin('notification.productAuction', 'productAuction')
      .where('receiver.id = :userId', { userId })
      .andWhere('!notification.isRead')
      .getRawMany();

    return {
      data: unreadNotifications,
      count: unreadNotifications.length,
    };
  }

  public async updateNotificationsToRead(userId: string) {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .update()
      .set({ isRead: true })
      .where('receiver.id = :userId', { userId })
      .andWhere('notification.isRead = 0')
      .execute();
  }

  public async updateNotificationToRead(notificationId: string) {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .update()
      .set({ isRead: true })
      .where('id = :notificationId', { notificationId })
      .execute();
  }
}
