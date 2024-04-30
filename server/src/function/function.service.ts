import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { getAuctionMaxBidPriceFunction } from './function-data/auction.function';
import {
  getAvailableTransport,
  isTransportInUse
} from './function-data/transport.function';
import { doesUserHaveIdFunction } from './function-data/token.function';
import { getDriverDetailsFunction } from './function-data/driver.function';
import { getAllLocationsFunction } from './function-data/delivery-order.function';

@Injectable()
export class FunctionService {
  constructor(private readonly entityManager: EntityManager) { }

  async seed(): Promise<void> {
    await this.seedFunction()
  }

  private functions: string[] = [
    getAllLocationsFunction,
    getAuctionMaxBidPriceFunction,
    isTransportInUse,
    doesUserHaveIdFunction,
    getAvailableTransport,
    getDriverDetailsFunction
  ];

  private async seedFunction(): Promise<void> {
    let i = 1;
    for (const func of this.functions) {
      await this.entityManager.query(func);
    }
  }
}
