import { Delivery } from 'src/delivery/delivery.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, Check, OneToMany } from 'typeorm';

export enum DriverStatus {
    Idle = 'Idle',
    Busy = 'Busy',
}

const statuses = Object.values(DriverStatus)
    .map((status) => `'${status}'`)
    .join(', ');

@Entity()
@Check(`"status" IN (${statuses})`)
export class DriverDetails extends Timestamps {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    licenseId: string;

    @Column()
    yearsOfExperience: number;

    @Column()
    carrierId: string;

    @ManyToOne(() => User, (user) => user.drivers)
    @JoinColumn({ name: 'carrierId' })
    carrier: User;

    @Column()
    userId: string;

    @OneToOne(() => User, (user) => user.driverDetails, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: DriverStatus.Idle })
    status: DriverStatus;

    @OneToMany(() => Delivery, (delivery) => delivery.driver)
    deliveries: Delivery[]
}