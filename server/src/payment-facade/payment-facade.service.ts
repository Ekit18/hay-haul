import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/lib/classes/payment.class';
import {
  PaymentStatus,
  PaymentTargetType,
  ServerEventName,
} from 'src/lib/enums/enums';
import { transformAndValidate } from 'src/lib/helpers/transformAndValidate';
import { NotificationMessage } from 'src/notification/enums/notification-message.enum';
import { NotificationService } from 'src/notification/notification.service';
import { ProductAuctionPayment } from 'src/product-auction-payment/product-auction-payment.entity';
import { ProductAuctionPaymentService } from 'src/product-auction-payment/product-auction-payment.service';
import {
  ProductAuction,
  ProductAuctionStatus,
} from 'src/product-auction/product-auction.entity';
import { SocketService } from 'src/socket/socket.service';
import { PaymentIntentMetadata } from 'src/stripe/stripe.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GetPaymentDto } from './dto/get-payment.dto';
import { GetPaymentsByUserIdResponse } from './dto/get-payments-by-user-id-response';
import { GetPaymentsByUserQueryDto } from './dto/get-payments-by-user-query.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { Notifiable } from 'src/notification/notification.entity';
import { DeliveryOrderPaymentService } from 'src/delivery-order-payment/delivery-order-payment.service';
import { DeliveryOrderPayment } from 'src/delivery-order-payment/delivery-order-payment.entity';
import { DeliveryOrder, DeliveryOrderStatus } from 'src/delivery-order/delivery-order.entity';

@Injectable()
export class PaymentFacadeService {
  constructor(
    @InjectRepository(ProductAuction)
    private productAuctionRepository: Repository<ProductAuction>,
    @InjectRepository(DeliveryOrder)
    private deliveryOrderRepository: Repository<DeliveryOrder>,
    private productAuctionPaymentService: ProductAuctionPaymentService,
    private deliveryOrderPaymentService: DeliveryOrderPaymentService,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) { }

  async getAllPaymentsByUserId(
    query: GetPaymentsByUserQueryDto,
    userId: User['id'],
  ): Promise<GetPaymentsByUserIdResponse> {
    const productAuctionPayments =
      await this.productAuctionPaymentService.findAllByUserId({
        query,
        userId,
      });
    const deliveryOrderPayments = await this.deliveryOrderPaymentService.findAllByUserId({
      query,
      userId,
    });
    //TODO:reserved for delivery order payments
    return {
      count: productAuctionPayments.count + 0,
      data: [...productAuctionPayments.data, ...deliveryOrderPayments.data].sort((a, b) => {
        return -1 * (a.status.localeCompare(b.status) || a.updatedAt.getDate() - b.updatedAt.getDate())
      }),
    };
  }

  async confirmPaymentByIntentId(
    paymentIntentId: string,
    buyerId: User['id'],
  ): Promise<PaymentResponseDto> {
    const paymentIntent =
      await this.stripeService.getPaymentIntentById(paymentIntentId);

    const metadata = await transformAndValidate(
      paymentIntent.metadata,
      PaymentIntentMetadata,
    );

    let payment: Payment | null = null;

    console.log('payment metadata');
    console.log(metadata);
    console.log(
      'metadata.paymentTargetType === PaymentTargetType.ProductAuction: %s',
      metadata.paymentTargetType === PaymentTargetType.ProductAuction,
    );

    if (metadata.paymentTargetType === PaymentTargetType.ProductAuction) {
      payment = await this.productAuctionPaymentService.findOneById(
        metadata.paymentId,
      );
    } else if (metadata.paymentTargetType === PaymentTargetType.DeliveryOrder) {
      //TODO: reserved for delivery order
      //payment = ...
      payment = await this.deliveryOrderPaymentService.findOneById(
        metadata.paymentId,
      );
    }

    console.log('payment');
    console.log(payment);

    if (!payment) {
      throw new BadRequestException({
        message: 'Such payment does not exist',
      });
    }

    if (payment.buyerId !== buyerId) {
      throw new BadRequestException({ message: 'Cannot save not own payment' });
    }
    if (metadata.paymentTargetType === PaymentTargetType.ProductAuction) {
      await this.productAuctionPaymentService.setPaymentStatus({
        paymentStatus: PaymentStatus.Paid,
        productAuctionPaymentId: payment.id,
      });

      const auctionId = (payment as ProductAuctionPayment).auctionId;

      const auction = await this.productAuctionRepository.findOne({
        where: { id: auctionId },
        relations: { product: { facilityDetails: { user: true } } },
      });

      await this.productAuctionRepository.save({
        auctionStatus: ProductAuctionStatus.Paid,
        id: auctionId,
      });

      SocketService.SocketServer.to(auctionId).emit(
        ServerEventName.AuctionUpdated,
        {
          auctionId,
          auctionStatus: ProductAuctionStatus.Paid,
        },
      );

      await this.notificationService.createNotification(
        auction.product.facilityDetails.user.id,
        auction.id,
        NotificationMessage.AuctionEndedWithBids,
        Notifiable.ProductAuction
      );

      return payment;
    } else {
      await this.deliveryOrderPaymentService.setPaymentStatus({
        paymentStatus: PaymentStatus.Paid,
        deliveryOrderPaymentId: payment.id,
      });

      const orderId = (payment as DeliveryOrderPayment).orderId;

      const order = await this.deliveryOrderRepository.findOne({
        where: { id: orderId },
        relations: { chosenDeliveryOffer: true },
      });

      console.log("FACADE ORDER", order)

      await this.deliveryOrderRepository.save({
        deliveryOrderStatus: DeliveryOrderStatus.Paid,
        id: orderId,
      });

      SocketService.SocketServer.to(orderId).emit(
        ServerEventName.DeliveryOrderUpdated,
        {
          deliveryOrderId: orderId, deliveryOrderStatus: DeliveryOrderStatus.Paid
        },
      );

      await this.notificationService.createNotification(
        order.chosenDeliveryOffer.userId,
        order.id,
        NotificationMessage.DeliveryOrderPaid,
        Notifiable.DeliveryOrder
      );

      return payment;
    }
  }

  async getPayment(dto: GetPaymentDto): Promise<PaymentResponseDto> {
    throw new Error('Method not implemented.');
  }
}
