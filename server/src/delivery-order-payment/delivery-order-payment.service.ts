import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { Repository } from 'typeorm';
import { DeliveryOrderPayment } from './delivery-order-payment.entity';
import { CreatePaymentDto } from 'src/payment-facade/dto/create-payment.dto';
import { PaymentStatus, PaymentTargetType } from 'src/lib/enums/enums';

@Injectable()
export class DeliveryOrderPaymentService {
    constructor(
        @InjectRepository(DeliveryOrderPayment) private deliveryOrderPaymentRepository: Repository<DeliveryOrderPayment>,
        @InjectRepository(DeliveryOrder) private deliveryOrderRepository: Repository<DeliveryOrder>,
    ) { }

    // async findAllByUserId({
    //     query,
    //     userId,
    //   }: {
    //     query?: GetPaymentsByUserQueryDto;
    //     userId: string;
    //   }): Promise<GetPaymentsByUserIdResponse> {
    //     const [data, count] =
    //       await this.productAuctionPaymentRepository.findAndCount({
    //         where: [{ buyerId: userId }, { sellerId: userId }],
    //         relations: {
    //           auction: { product: { facilityDetails: true } },
    //         },
    //         order: { status: 'DESC', createdAt: 'DESC' },
    //         take: query?.limit,
    //         skip: query?.offset,
    //       });
    //     return {
    //       count,
    //       data: data.map(({ auction, ...payment }) => ({
    //         ...payment,
    //         target: auction,
    //         direction:
    //           payment.sellerId === userId
    //             ? PaymentDirection.Sale
    //             : PaymentDirection.Purchase,
    //       })),
    //     };
    //   }

    async findOneById(id: string) {
        return await this.deliveryOrderPaymentRepository.findOneBy({ id });
    }

    async create(dto: CreatePaymentDto) {
        let [payment] = await this.deliveryOrderPaymentRepository.find({
            where: {
                buyerId: dto.buyerId,
                sellerId: dto.sellerId,
                orderId: dto.targetId,
            },
        });

        if (!payment) {
            payment = await this.deliveryOrderPaymentRepository.save({
                buyerId: dto.buyerId,
                sellerId: dto.sellerId,
                auctionId: dto.targetId,
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
