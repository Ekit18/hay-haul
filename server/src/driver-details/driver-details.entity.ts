import { Timestamps } from 'src/lib/classes/timestamps.class';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, Check } from 'typeorm';

export enum DriverStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

const roles = Object.values(DriverStatus)
    .map((role) => `'${role}'`)
    .join(', ');

@Entity()
@Check(`"status" IN (${roles})`)
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

    @OneToOne(() => User, (user) => user.driverDetails)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: DriverStatus.Inactive })
    status: DriverStatus;
}