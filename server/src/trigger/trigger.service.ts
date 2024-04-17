import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  updateAuctionStatusTrigger,
  updateAuctionTrigger,
} from './trigger-data/auction.trigger';
import { productAuctionBidTrigger } from './trigger-data/product-auction-bid.trigger';
import { deleteProductTypeTrigger } from './trigger-data/product.trigger';

@Injectable()
export class TriggerService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    await this.seedTrigger();
  }

  private triggers: string[] = [
    updateAuctionTrigger,
    deleteProductTypeTrigger,
    productAuctionBidTrigger,
    updateAuctionStatusTrigger,
  ];

  private async seedTrigger() {
    for (const trigger of this.triggers) {
      await this.entityManager.query(trigger);
    }
  }
}
