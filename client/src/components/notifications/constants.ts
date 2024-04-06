import { NotificationMessage } from '@/lib/enums/notification-message.enum';
import { AlertCircleIcon, LucideIcon } from 'lucide-react';

//todo: add more messages, and colors
export const notificationMessages: Record<NotificationMessage, { icon: LucideIcon; message: string }> = {
  [NotificationMessage.BidOverbid]: {
    icon: AlertCircleIcon,
    message: 'Your bid was overbid on a product auction.'
  }
  //   [NotificationMessage.BidWon]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'You have won a bid on a product',
  //   },
  //   [NotificationMessage.BidLost]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'You have lost a bid on a product',
  //   },
  //   [NotificationMessage.ProductSold]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your product has been sold',
  //   },
  //   [NotificationMessage.ProductUnsold]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your product has been unsold',
  //   },
  //   [NotificationMessage.ProductAuctionEnded]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your product auction has ended',
  //   },
  //   [NotificationMessage.ProductAuctionStarted]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your product auction has started',
  //   },
  //   [NotificationMessage.ProductAuctionUpdated]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your product auction has been updated',
  //   },
  //   [NotificationMessage.ProductAuctionDeleted]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your product auction has been deleted',
  //   },
  //   [NotificationMessage.ProductAuctionCreated]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your product auction has been created',
  //   },
  //   [NotificationMessage.ProductAuctionBidPlaced]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'A bid has been placed on your product auction',
  //   },
  //   [NotificationMessage.ProductAuctionBidOverbid]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'Your bid has been overbid on a product auction',
  //   },
  //   [NotificationMessage.ProductAuctionBidWon]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'You have won a bid on a product auction',
  //   },
  //   [NotificationMessage.ProductAuctionBidLost]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'You have lost a bid on a product auction',
  //   },
  //   [NotificationMessage.ProductAuctionBidPlacedOnYourProduct]: {
  //     icon: LucideIcon.AlertCircle,
  //     message: 'A bid has been placed on your product',
  //   },
};
