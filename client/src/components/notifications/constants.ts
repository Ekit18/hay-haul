import { NotificationMessage } from '@/lib/enums/notification-message.enum';
import { AlertCircleIcon, LucideIcon } from 'lucide-react';

// todo: add more messages, and colors
export const notificationMessages: Record<NotificationMessage, { icon: LucideIcon; message: string }> = {
  [NotificationMessage.BidOverbid]: {
    icon: AlertCircleIcon,
    message: 'Your bid was overbid on a product auction.'
  },
  [NotificationMessage.ResumeAppointment]: {
    icon: AlertCircleIcon,
    message: 'Appointment has been resumed'
  },
  [NotificationMessage.AuctionStartSoon]: {
    icon: AlertCircleIcon,
    message: 'Auction will start soon'
  },
  [NotificationMessage.AuctionStarted]: {
    icon: AlertCircleIcon,
    message: 'Auction has started'
  },
  [NotificationMessage.FarmerAuctionEndSoon]: {
    icon: AlertCircleIcon,
    message: 'Farmer auction will end soon'
  },
  [NotificationMessage.BusinessmanAuctionEndSoon]: {
    icon: AlertCircleIcon,
    message: 'Businessman auction will end soon'
  },
  [NotificationMessage.AuctionEndedNoBids]: {
    icon: AlertCircleIcon,
    message: 'Auction ended with no bids'
  },
  [NotificationMessage.AuctionEndedWithBids]: {
    icon: AlertCircleIcon,
    message: 'Auction ended with bids'
  },
  [NotificationMessage.AuctionPaid]: {
    icon: AlertCircleIcon,
    message: 'Auction was paid'
  },
  [NotificationMessage.BusinessmanAuctionWon]: {
    icon: AlertCircleIcon,
    message: 'You have won the businessman auction'
  },
  [NotificationMessage.BusinessmanAuctionPaymentOverdue]: {
    icon: AlertCircleIcon,
    message: 'Payment for businessman auction is overdue'
  },
  [NotificationMessage.FarmerAuctionPaymentOverdue]: {
    icon: AlertCircleIcon,
    message: 'Payment for farmer auction is overdue'
  },
  [NotificationMessage.DeliveryOrderPaid]: {
    icon: AlertCircleIcon,
    message: 'Delivery order has been paid'
  },
  [NotificationMessage.DeclinedDeliveryOffer]: {
    icon: AlertCircleIcon,
    message: 'Delivery offer has been declined'
  },
  [NotificationMessage.AcceptedDeliveryOffer]: {
    icon: AlertCircleIcon,
    message: 'Delivery offer has been accepted'
  },
  [NotificationMessage.DriverAcceptedDelivery]: {
    icon: AlertCircleIcon,
    message: 'Driver has accepted the delivery'
  },
  [NotificationMessage.DriverArriveToFarm]: {
    icon: AlertCircleIcon,
    message: 'Driver has arrived to the farm'
  },
  [NotificationMessage.DriverLoading]: {
    icon: AlertCircleIcon,
    message: 'Driver is loading'
  },
  [NotificationMessage.DriverOnTheWay]: {
    icon: AlertCircleIcon,
    message: 'Driver is on the way'
  },
  [NotificationMessage.DriverUnloading]: {
    icon: AlertCircleIcon,
    message: 'Driver is unloading'
  },
  [NotificationMessage.DriverArriveToBusiness]: {
    icon: AlertCircleIcon,
    message: 'Driver has arrived to the warehouse'
  },
  [NotificationMessage.DriverEndedDelivery]: {
    icon: AlertCircleIcon,
    message: 'Driver has ended the delivery'
  },
  [NotificationMessage.CarrierAssignedDriver]: {
    icon: AlertCircleIcon,
    message: 'Carrier has assigned you for delivery'
  }
};
