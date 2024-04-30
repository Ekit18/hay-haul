import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { createProductProcedure, deleteProductProcedure, deleteProductTypeProcedure, updateProductTypeProcedure } from './procedures-data/product.procedure';
import { deleteOrderByIdProcedure } from './procedures-data/delivery-order.procedure';
import { createOfferProcedure } from './procedures-data/delivery-offer.procedure';
import { deleteFacilityDetailsProcedure } from './procedures-data/facility-details.procedure';

@Injectable()
export class ProcedureService {
  constructor(private readonly entityManager: EntityManager) { }

  async seed(): Promise<void> {
    await this.seedProcedure()
  }

  private procedures: string[] = [createProductProcedure, deleteFacilityDetailsProcedure, deleteProductTypeProcedure, deleteOrderByIdProcedure, createOfferProcedure, updateProductTypeProcedure, deleteProductProcedure];

  private async seedProcedure(): Promise<void> {
    for (const func of this.procedures) {
      await this.entityManager.query(func);
    }
  }
}
