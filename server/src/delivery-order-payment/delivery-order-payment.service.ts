import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { EntityManager, Repository } from 'typeorm';
import { DeliveryOrderPayment } from './delivery-order-payment.entity';
import { CreatePaymentDto } from 'src/payment-facade/dto/create-payment.dto';
import { PaymentDirection, PaymentStatus, PaymentTargetType } from 'src/lib/enums/enums';
import { GetPaymentsByUserQueryDto } from 'src/payment-facade/dto/get-payments-by-user-query.dto';
import { GetPaymentsByUserIdResponse } from 'src/payment-facade/dto/get-payments-by-user-id-response';

@Injectable()
export class DeliveryOrderPaymentService {
    constructor(
        @InjectRepository(DeliveryOrderPayment) private deliveryOrderPaymentRepository: Repository<DeliveryOrderPayment>,
        @InjectRepository(DeliveryOrder) private deliveryOrderRepository: Repository<DeliveryOrder>,
    ) { }

    async findAllByUserId({
        query,
        userId,
    }: {
        query?: GetPaymentsByUserQueryDto;
        userId: string;
    }): Promise<GetPaymentsByUserIdResponse> {
        const [data, count] =
            await this.deliveryOrderPaymentRepository.findAndCount({
                where: [{ buyerId: userId }, { sellerId: userId }],
                relations: {
                    order: { productAuction: { product: { facilityDetails: true } } },
                },
                order: { status: 'DESC', createdAt: 'DESC' },
                take: query?.limit,
                skip: query?.offset,
            });
        return {
            count,
            data: data.map(({ order, ...payment }) => ({
                ...payment,
                target: order,
                direction:
                    payment.sellerId === userId
                        ? PaymentDirection.Sale
                        : PaymentDirection.Purchase,
            })),
        };
    }

    async findOneById(id: string) {
        return await this.deliveryOrderPaymentRepository.findOneBy({ id });
    }

    async create(dto: CreatePaymentDto, transactionalEntityManager?: EntityManager | undefined) {

        let [payment] = transactionalEntityManager ? await transactionalEntityManager.find(DeliveryOrderPayment, {
            where: {
                buyerId: dto.buyerId,
                sellerId: dto.sellerId,
                orderId: dto.targetId,
            },
        }) : await this.deliveryOrderPaymentRepository.find({
            where: {
                buyerId: dto.buyerId,
                sellerId: dto.sellerId,
                orderId: dto.targetId,
            },
        });

        if (!payment) {
            payment = transactionalEntityManager ? await transactionalEntityManager.save(DeliveryOrderPayment, {
                buyerId: dto.buyerId,
                sellerId: dto.sellerId,
                auctionId: dto.targetId,
                orderId: dto.targetId,
                amount: dto.amount,
                targetType: PaymentTargetType.DeliveryOrder,
            }) : await this.deliveryOrderPaymentRepository.save({
                buyerId: dto.buyerId,
                sellerId: dto.sellerId,
                auctionId: dto.targetId,
                orderId: dto.targetId,
                amount: dto.amount,
                targetType: PaymentTargetType.DeliveryOrder,
            });
        }
        return payment;
    }

    async setPaymentStatus({
        paymentStatus,
        deliveryOrderPaymentId,
    }: {
        deliveryOrderPaymentId: string;
        paymentStatus: PaymentStatus;
    }): Promise<DeliveryOrderPayment> {
        return await this.deliveryOrderPaymentRepository.save({
            id: deliveryOrderPaymentId,
            status: paymentStatus,
        });
    }
}
