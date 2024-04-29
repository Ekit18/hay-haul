import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { getAuctionMaxBidPriceFunction } from './function-data/auction.function';
import { getAvailableTransport, isTransportInUse } from './function-data/transport.function';
import { doesUserHaveIdFunction } from './function-data/token.function';
import { getDriverDetailsFunction } from './function-data/driver.function';

@Injectable()
export class FunctionService {
  constructor(private readonly entityManager: EntityManager) { }

  async seed(): Promise<void> {
    await this.seedFunction()
  }

  private functions: string[] = [getAuctionMaxBidPriceFunction, isTransportInUse, doesUserHaveIdFunction, getAvailableTransport, getDriverDetailsFunction];

  private async seedFunction(): Promise<void> {
    for (const func of this.functions) {
      await this.entityManager.query(func);
    }
  }
}
