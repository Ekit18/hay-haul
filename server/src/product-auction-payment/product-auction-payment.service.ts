import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentTargetType } from 'src/lib/enums/enums';
import { transformAndValidate } from 'src/lib/helpers/transformAndValidate';
import {
  ProductAuction,
  ProductAuctionStatus,
} from 'src/product-auction/product-auction.entity';
import { PaymentIntentMetadata } from 'src/stripe/stripe.entity';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { ProductAuctionPayment } from './product-auction-payment.entity';

@Injectable()
export class ProductAuctionPaymentService {
  constructor(
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    private stripeService: StripeService,
    @InjectRepository(ProductAuctionPayment)
    private productAuctionPaymentRepository: Repository<ProductAuctionPayment>,
  ) {}

  async createByPaymentIntent(
    paymentIntent: Stripe.Response<Stripe.PaymentIntent>,
  ): Promise<ProductAuctionPayment> {
    const metadata = await transformAndValidate(
      paymentIntent.metadata,
      PaymentIntentMetadata,
    );
    let [payment] = await this.productAuctionPaymentRepository.find({
      where: {
        buyerId: metadata.buyerId,
        sellerId: metadata.sellerId,
        auctionId: metadata.targetId,
      },
    });

    if (!payment) {
      payment = await this.productAuctionPaymentRepository.save({
        buyerId: metadata.buyerId,
        sellerId: metadata.sellerId,
        auctionId: metadata.targetId,
        amount: paymentIntent.amount,
        targetType: PaymentTargetType.ProductAuction,
      });
      await this.productAuctionRepository.update(metadata.targetId, {
        auctionStatus: ProductAuctionStatus.Paid,
      });
    }
    return payment;
  }
}
