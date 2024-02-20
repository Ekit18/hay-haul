import { Test, TestSuite } from 'nestjs-mocha-decorators';
const chai = require('chai'),
  spies = require('chai-spies');

chai.use(spies);

const should = chai.should(),
  expect = chai.expect;

@TestSuite('TokenService')
export class TokenServiceTest {
  @Test('Get Test WORKDSDSADASDAS')
  async testGet(): Promise<void> {
    expect(2).to.equal(2);
  }
  // private service: TokenService;
  // private repo: Repository<Token>;

  // @TestEvent(TestEventsEnum.BEFORE_EACH)
  // async test() {
  //   const module: TestingModule = await NativeTest.createTestingModule({
  //     providers: [
  //       TokenService,
  //       { provide: getRepositoryToken(Token), useClass: Repository },
  //       { provide: JwtService, useValue: {} },
  //       { provide: ConfigService, useValue: {} },
  //     ],
  //   }).compile();

  //   this.service = module.get<TokenService>(TokenService);
  //   this.repo = module.get<Repository<Token>>(getRepositoryToken(Token));
  // }

  // @Test('should be defined')
  // testServiceDefined() {
  //   expect(this.service).to.be.defined;
  // }

  // @Test('getRefreshTokenByUserId')
  // async testGetRefreshTokenByUserId() {
  //   const result = new Token();
  //   const repoSpy = jest.spyOn(this.repo, 'findOne').mockResolvedValue(result);
  //   expect(await this.service.getRefreshTokenByUserId('1')).to.equal(result);
  //   expect(repoSpy).toBeCalledWith({ where: { userId: '1' } });
  // }

  // @Test('generateTokens')
  // async testGenerateTokens() {
  //   const user = new User();
  //   user.id = '1';
  //   user.email = 'test@test.com';
  //   user.isVerified = true;
  //   const result = { refreshToken: 'refresh', accessToken: 'access' };
  //   const jwtSpy = jest
  //     .spyOn(JwtService.prototype, 'sign')
  //     .mockReturnValue('token');
  //   const repoSpy = jest.spyOn(this.repo, 'save').mockResolvedValue(undefined);
  //   expect(await this.service.generateTokens(user)).to.equal(result);
  //   expect(jwtSpy).toBeCalledTimes(2);
  //   expect(repoSpy).toBeCalledWith({
  //     userId: user.id,
  //     role: user.role,
  //     refreshToken: 'token',
  //   });
  // }

  // @Test('checkToken')
  // testCheckToken() {
  //   const result = { id: '1', email: 'test@test.com', isVerified: true };
  //   const jwtSpy = jest
  //     .spyOn(JwtService.prototype, 'verify')
  //     .mockReturnValue(result);
  //   expect(this.service.checkToken('token', TokenTypeEnum.ACCESS)).to.equal(
  //     result,
  //   );
  //   expect(jwtSpy).toBeCalledWith('token', {
  //     secret: 'test',
  //   });
  // }
}
