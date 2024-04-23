import { ProductAuctionStatus, ProductAuctionStatusValues } from '@/lib/types/ProductAuction/ProductAuction.type';

export const productAuctionStatusToReadableMap: Record<ProductAuctionStatusValues, string> = {
    [ProductAuctionStatus.Active]: 'Active',
    [ProductAuctionStatus.Inactive]: 'Inactive',
    [ProductAuctionStatus.Paid]: 'Paid',
    [ProductAuctionStatus.WaitingPayment]: 'Waiting Payment',
    [ProductAuctionStatus.StartSoon]: 'Starts soon',
    [ProductAuctionStatus.EndSoon]: 'Ends soon',
    [ProductAuctionStatus.Ended]: 'Ended',
    [ProductAuctionStatus.Closed]: 'Closed',
    [ProductAuctionStatus.Unpaid]: 'Unpaid',
} as const