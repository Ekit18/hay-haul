import { SelectQueryBuilder } from 'typeorm';

export class MockTypeOrmModule {
  public getRepository<T>(): undefined {
    return undefined;
  }

  public createQueryBuilder<T>(
    entityName: string,
    alias: string,
  ): SelectQueryBuilder<T> {
    const mockQueryBuilder = new SelectQueryBuilder<T>(undefined);
    jest.spyOn(mockQueryBuilder, 'getMany').mockResolvedValue([]);
    jest.spyOn(mockQueryBuilder, 'getOne').mockResolvedValue(undefined);
    return mockQueryBuilder;
  }

  public query(query: string, parameters?: any[]): Promise<any> {
    return Promise.resolve();
  }
}
