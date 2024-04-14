import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { PaymentTargetType } from 'src/lib/enums/enums';
import { transformAndValidate } from 'src/lib/helpers/transformAndValidate';
import { ProductAuctionPaymentService } from 'src/product-auction-payment/product-auction-payment.service';
import { PaymentIntentMetadata } from 'src/stripe/stripe.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { GetPaymentDto } from './dto/get-payment.dto';
import { GetPaymentsByUserIdResponseDto } from './dto/get-payments-by-user-id-response.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentFacadeService {
  constructor(
    private productAuctionPaymentService: ProductAuctionPaymentService,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
    private userService: UserService,
  ) {}

  async getAllPaymentsByUserId(
    userId: User['id'],
  ): Promise<GetPaymentsByUserIdResponseDto> {
    const { productAuctionPaymentsAsBuyer, productAuctionPaymentsAsSeller } =
      await this.userService.getUserById(userId);
    return {
      purchases: [
        ...productAuctionPaymentsAsBuyer.map((payment) => ({
          ...payment,
          target: payment.auction,
        })),
      ],
      sales: [
        ...productAuctionPaymentsAsSeller.map((payment) => ({
          ...payment,
          target: payment.auction,
        })),
      ],
    };
  }

  async savePaymentByIntentId(
    paymentIntentId: string,
    buyerId: User['id'],
  ): Promise<PaymentResponseDto> {
    console.log('metadata1');
    const paymentIntent =
      await this.stripeService.getPaymentIntentById(paymentIntentId);
    console.log('metadata2');
    const metadata = await transformAndValidate(
      paymentIntent.metadata,
      PaymentIntentMetadata,
    );
    console.log('metadata3');
    console.log(metadata);
    if (metadata.buyerId !== buyerId) {
      throw new BadRequestException({ message: 'Cannot save not own payment' });
    }
    if (metadata.paymentTarget === PaymentTargetType.ProductAuction) {
      const payment =
        await this.productAuctionPaymentService.createByPaymentIntent(
          paymentIntent,
        );
      return {
        id: payment.id,
        targetType: metadata.paymentTarget,
      };
    } else {
      return {
        id: '',
        targetType: PaymentTargetType.DeliveryOrder,
      };
    }
  }

  async getPayment(dto: GetPaymentDto): Promise<PaymentResponseDto> {
    throw new Error('Method not implemented.');
  }
}
