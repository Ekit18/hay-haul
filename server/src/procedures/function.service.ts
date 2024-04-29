import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class FunctionService {
  constructor(private readonly entityManager: EntityManager) { }

  async seed(): Promise<void> {
    await this.seedFunction()
  }

  private functions: string[] = [];

  private async seedFunction(): Promise<void> {
    for (const func of this.functions) {
      await this.entityManager.query(func);
    }
  }
}
