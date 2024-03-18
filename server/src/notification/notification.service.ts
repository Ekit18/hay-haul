import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerEventName } from 'src/lib/enums/enums';
import { SocketService } from 'src/socket/socket.service';
import { Repository } from 'typeorm';
import { NotificationMessage } from './enums/notification-message.enum';
import { Notification } from './notification.entity';
import {
  NotificationsListResponse,
  UnreadNotificationsResponse,
} from './types/notification.type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly socketService: SocketService,
  ) {}

  async getNotifications(userId: string): Promise<NotificationsListResponse> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .select([
        'notification.id AS id',
        'productAuction.id AS productAuction',
        'notification.message AS status',
        `CONCAT(sender.firstName, ' ', sender.lastName) AS user`,
      ])
      .innerJoin('notification.receiver', 'receiver')
      .innerJoin('notification.productAuction', 'productAuction')
      .where('receiver.id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getRawMany();

    return { data: notifications, count: notifications.length };
  }

  public async createNotification(
    userId: string,
    productAuctionId: string,
    message: NotificationMessage,
  ): Promise<void> {
    await this.notificationRepository.save({
      message,
      isRead: false,
      receiverId: userId,
      productAuctionId,
    });

    this.socketService.socketServer
      .to(userId)
      .emit(ServerEventName.Notification, message);
  }

  // public async createNotificationWithTransaction(
  //   userId: string,
  //   productAuctionId: string,
  //   message: NotificationMessage,
  //   transactionalEntityManager: EntityManager,
  // ): Promise<void> {
  //   const newNotification = transactionalEntityManager.create(Notification, {
  //     message,
  //     receiver: { id: userId },
  //     productAuction: { id: productAuctionId },
  //   });

  //   await transactionalEntityManager.save(newNotification);
  // }

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
      .andWhere('!notification.isRead')
      .execute();
  }
}
