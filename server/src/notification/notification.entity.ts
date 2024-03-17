import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';

import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationMessage } from './enums/notification-message.enum';

const notificationMessages = Object.values(NotificationMessage)
  .map((notificationMessage) => `'${notificationMessage}'`)
  .join(', ');

@Entity()
@Check(`"message" IN (${notificationMessages})`)
export class Notification {
  @ApiProperty({
    description: 'Unique identifier for notification',
    example: 'e02769c5-60c7-4c88-8372-6c2598f9a234',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
  })
  message: NotificationMessage;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;

  // @ApiProperty({
  //   description: 'Link to the associated appointment',
  //   type: () => User,
  // })
  // @ManyToOne(() => Appointment, (appointment) => appointment.notification, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'appointmentId' })
  // appointment: Appointment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;
}
