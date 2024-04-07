import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { run } from 'mocha';
import { MochaTestModule, MochaTestService } from 'nestjs-mocha-decorators';
import { AppModuleTest } from 'src/appmoduleTest';
import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { FacilityDetailsModule } from 'src/facility-details/facility-details.module';
import { FacilityDetailsServiceTest } from 'src/facility-details/facility-details.test';
import { ProductType } from 'src/product-type/product-type.entity';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { ProductTypeServiceTest } from 'src/product-type/product-type.test';
import { Product } from 'src/product/product.entity';
import { ProductModule } from 'src/product/product.module';
import { ProductServiceTest } from 'src/product/product.test';
import { StripeEntry } from 'src/stripe/stripe.entity';
import { UserModule } from 'src/user/user.module';

const initNest = async (): Promise<INestApplication> => {
  const testingModuleBuilder: TestingModuleBuilder =
    await Test.createTestingModule({
      imports: [
        AppModuleTest,
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
            TypeOrmModule.forFeature([
              Product,
              FacilityDetails,
              ProductType,
            ]),
            ProductModule,
          ],
        ),
      ],
    });

  const testingModule: TestingModule = await testingModuleBuilder.compile();
  const app = testingModule.createNestApplication();

  app.useLogger(new ConsoleLogger());
  app.listen(4343);

  return app;
};

(async (): Promise<void> => {
  try {
    const app = await initNest();
    app.get(MochaTestService).declareTests();
    run();
  } catch (err) {
    console.error(err);
  }
})();
