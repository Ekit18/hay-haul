import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { NotificationErrorMessage } from './enums/notification-error-message.enum';
import { NotificationMessage } from './enums/notification-message.enum';
import {
  NotificationsListResponse,
  UnreadNotificationsResponse,
} from './types/notification.type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getNotifications(userId: string): Promise<NotificationsListResponse> {
    try {
      const notifications = await this.notificationRepository
        .createQueryBuilder('notification')
        .select([
          'notification.id AS id',
          'appointment.id AS appointmentId',
          'notification.message AS status',
          `CONCAT(sender.firstName, ' ', sender.lastName) AS user`,
        ])
        .innerJoin('notification.sender', 'sender')
        .innerJoin('notification.receiver', 'receiver')
        .innerJoin('notification.appointment', 'appointment')
        .where('receiver.id = :userId', { userId })
        .orderBy('notification.createdAt', 'DESC')
        .getRawMany();

      return { data: notifications, count: notifications.length };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createNotification(
    userId: string,
    appointmentId: string,
    message: NotificationMessage,
    initiatorUserId?: string,
  ): Promise<void> {
    try {
      const newNotification = this.notificationRepository.create({
        message,
        isRead: false,
        sender: { id: initiatorUserId },
        receiver: { id: userId },
        appointment: { id: appointmentId },
      });

      await this.notificationRepository
        .createQueryBuilder()
        .insert()
        .into(Notification)
        .values(newNotification)
        .execute();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createNotificationWithTransaction(
    userId: string,
    appointmentId: string,
    message: NotificationMessage,
    initiatorUserId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    try {
      const newNotification = transactionalEntityManager.create(Notification, {
        message,
        sender: { id: initiatorUserId },
        receiver: { id: userId },
        appointment: { id: appointmentId },
      });

      await transactionalEntityManager.save(newNotification);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUnreadNotifications(
    userId: string,
  ): Promise<UnreadNotificationsResponse> {
    try {
      const unreadNotifications = await this.notificationRepository
        .createQueryBuilder('notification')
        .select([
          'notification.id AS id',
          'appointment.id AS appointmentId',
          'notification.message AS status',
          `CONCAT(sender.firstName, ' ', sender.lastName) AS user`,
        ])
        .innerJoin('notification.sender', 'sender')
        .innerJoin('notification.receiver', 'receiver')
        .innerJoin('notification.appointment', 'appointment')
        .where('receiver.id = :userId', { userId })
        .andWhere('!notification.isRead')
        .getRawMany();

      if (!unreadNotifications) {
        throw new HttpException(
          NotificationErrorMessage.UnreadNotificationsNotFound,
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: unreadNotifications,
        count: unreadNotifications.length,
      };
    } catch (error) {
      throw new HttpException(
        NotificationErrorMessage.FailedFetchUnreadNotifications,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateNotificationsToRead(userId: string): Promise<void> {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);

      if (!unreadNotifications) {
        throw new HttpException(
          NotificationErrorMessage.UnreadNotificationsNotFound,
          HttpStatus.BAD_REQUEST,
        );
      }

      const unreadNotificationsIds = unreadNotifications.data.map(
        (notification) => notification.id,
      );

      await this.notificationRepository
        .createQueryBuilder()
        .update(Notification)
        .set({ isRead: true })
        .whereInIds(unreadNotificationsIds)
        .execute();
    } catch (error) {
      throw new HttpException(
        NotificationErrorMessage.FailedUpdateNotification,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
