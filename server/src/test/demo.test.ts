import expect from 'expect';
import { Test, TestSuite } from 'nestjs-mocha-decorators';

@TestSuite('Demo Test Suite')
export class DemoTest {
  @Test('Get Test')
  async testGet(): Promise<void> {
    expect(1).toBe(1);
  }
}
