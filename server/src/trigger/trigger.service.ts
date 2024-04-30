import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import {
  updateAuctionStatusTrigger,
  updateAuctionTrigger,
} from './trigger-data/auction.trigger';
import { productAuctionBidTrigger } from './trigger-data/product-auction-bid.trigger';
import { insertUserTrigger } from './trigger-data/user.trigger';
import { updateOrDeleteTransportTrigger } from './trigger-data/transport.trigger';
import { createTokenTrigger } from './trigger-data/token.trigger';

@Injectable()
export class TriggerService {
  constructor(private readonly entityManager: EntityManager) { }

  async seed(): Promise<void> {
    await this.seedTrigger();
  }

  private triggers: string[] = [
    updateAuctionTrigger,
    productAuctionBidTrigger,
    updateAuctionStatusTrigger,
    insertUserTrigger,
    updateOrDeleteTransportTrigger,
    createTokenTrigger
  ];

  private async seedTrigger() {
    for (const trigger of this.triggers) {
      await this.entityManager.query(trigger);
    }
  }
}
