import expect from 'expect';
import { Test, TestEventsSuite, TestSuite } from 'nestjs-mocha-decorators';

@TestEventsSuite()
@TestSuite('Demo Test Suite')
export class DemoTest {
  @Test('Get Test WORKDSDSADASDAS')
  async testGet(): Promise<void> {
    expect(1).toBe(1);
  }
}
