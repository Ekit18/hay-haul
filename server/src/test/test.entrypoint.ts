import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { run } from 'mocha';
import { MochaTestModule, MochaTestService } from 'nestjs-mocha-decorators';
import { AppModule } from 'src/app.module';
import { FacilityDetailsModule } from 'src/facility-details/facility-details.module';
import { FacilityDetailsServiceTest } from 'src/facility-details/facility-details.test';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { ProductTypeServiceTest } from 'src/product-type/product-type.test';
import { ProductModule } from 'src/product/product.module';
import { ProductServiceTest } from 'src/product/product.test';
import { UserModule } from 'src/user/user.module';
import { MockTypeOrmModule } from './MockTypeOrmModule';

const initNest = async (): Promise<INestApplication> => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [
      TypeOrmModule.forRootAsync({
        useFactory: async () => ({
          type: 'mssql',
          host: 'localhost',
          port: 0,
          username: 'localhost',
          password: 'localhost',
          database: 'localhost',
          entities: [],
          // logger: 'simple-console',
          logging: true,
        }),
      }),
      AppModule,
      MochaTestModule.registerTests(
        [
          ProductServiceTest,
          FacilityDetailsServiceTest,
          ProductTypeServiceTest,
        ],
        [
          FacilityDetailsModule,
          UserModule,
          ProductTypeModule,
          // TypeOrmModule.forFeature([Product, FacilityDetails, ProductType]),
          ProductModule,
        ],
      ),
    ],
  })
    .overrideModule(TypeOrmModule)
    .useModule(MockTypeOrmModule);
  // .overrideProvider(TypeOrmModule)
  // .useClass(MockTypeOrmModule);

  const testingModule: TestingModule = await testingModuleBuilder.compile();
  const app = testingModule.createNestApplication();

  app.useLogger(new ConsoleLogger());
  app.listen(4343);

  return app;
};

(async (): Promise<void> => {
  const app = await initNest();
  app.get(MochaTestService).declareTests();
  run();
})();
