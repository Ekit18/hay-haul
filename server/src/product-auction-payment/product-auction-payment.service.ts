import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaymentDirection,
  PaymentStatus,
  PaymentTargetType,
} from 'src/lib/enums/enums';
import { GetPaymentsByUserIdResponse } from 'src/payment-facade/dto/get-payments-by-user-id-response';
import { GetPaymentsByUserQueryDto } from 'src/payment-facade/dto/get-payments-by-user-query.dto';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { Repository } from 'typeorm';
import { ProductAuctionPayment } from './product-auction-payment.entity';
import { CreatePaymentDto } from '../payment-facade/dto/create-payment.dto'

@Injectable()
export class ProductAuctionPaymentService {
  constructor(
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private stripeService: StripeService,
    @InjectRepository(ProductAuctionPayment)
    private productAuctionPaymentRepository: Repository<ProductAuctionPayment>,
  ) { }

  async findAllByUserId({
    query,
    userId,
  }: {
    query?: GetPaymentsByUserQueryDto;
    userId: string;
  }): Promise<GetPaymentsByUserIdResponse> {
    const [data, count] =
      await this.productAuctionPaymentRepository.findAndCount({
        where: [{ buyerId: userId }, { sellerId: userId }],
        relations: {
          auction: { product: { facilityDetails: true } },
        },
        order: { status: 'DESC', createdAt: 'DESC' },
        take: query?.limit,
        skip: query?.offset,
      });
    return {
      count,
      data: data.map(({ auction, ...payment }) => ({
        ...payment,
        target: auction,
        direction:
          payment.sellerId === userId
            ? PaymentDirection.Sale
            : PaymentDirection.Purchase,
      })),
    };
  }

  async findOneById(id: string) {
    return await this.productAuctionPaymentRepository.findOneBy({ id });
  }

  async create(dto: CreatePaymentDto) {
    let [payment] = await this.productAuctionPaymentRepository.find({
      where: {
        buyerId: dto.buyerId,
        sellerId: dto.sellerId,
        auctionId: dto.targetId,
      },
    });

    if (!payment) {
      payment = await this.productAuctionPaymentRepository.save({
        buyerId: dto.buyerId,
        sellerId: dto.sellerId,
        auctionId: dto.targetId,
        amount: dto.amount,
        targetType: PaymentTargetType.ProductAuction,
      });
    }
    return payment;
  }

  async setPaymentStatus({
    paymentStatus,
    productAuctionPaymentId,
  }: {
    productAuctionPaymentId: string;
    paymentStatus: PaymentStatus;
  }): Promise<ProductAuctionPayment> {
    return await this.productAuctionPaymentRepository.save({
      id: productAuctionPaymentId,
      status: paymentStatus,
    });
  }
}
