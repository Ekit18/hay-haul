import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { getAuctionMaxBidPriceFunction } from './function-data/auction.function';

@Injectable()
export class FunctionService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    await Promise.all([this.seedFunction()]);
  }

  private functions: string[] = [getAuctionMaxBidPriceFunction];

  private async seedFunction(): Promise<void> {
    this.functions.map(async (func) => {
      await this.entityManager.query(func);
    });
  }
}
