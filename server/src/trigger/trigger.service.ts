import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { deleteProductTypeProcedure } from './trigger-data/product.trigger';

@Injectable()
export class TriggerService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    await Promise.all([this.seedTrigger()]);
  }

  private triggers: string[] = [
    deleteProductTypeProcedure,
    // productAuctionBidTrigger,
  ];

  private async seedTrigger(): Promise<void> {
    this.triggers.map(async (trigger) => {
      await this.entityManager.query(trigger);
    });
  }
}
