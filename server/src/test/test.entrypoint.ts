import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { run } from 'mocha';
import { MochaTestModule, MochaTestService } from 'nestjs-mocha-decorators';
import { AppModule } from 'src/app.module';
import { DemoTest } from './demo.test';

const initNest = async (): Promise<INestApplication> => {
  const testingModuleBuilder: TestingModuleBuilder =
    await Test.createTestingModule({
      imports: [AppModule, MochaTestModule.registerTests([DemoTest])],
    });
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
