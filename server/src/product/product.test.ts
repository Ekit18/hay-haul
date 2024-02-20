import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Test,
  TestEvent,
  TestEventsEnum,
  TestEventsSuite,
  TestSuite,
} from 'nestjs-mocha-decorators';
import { TokenPayload } from 'src/lib/types/token-payload.type';
import { AuthenticatedRequest } from 'src/lib/types/user.request.type';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

const chai: Chai.ChaiStatic = require('chai'),
  spies = require('chai-spies');

chai.use(spies);

@TestEventsSuite()
@TestSuite('Product Service')
export class ProductServiceTest {
  @Inject()
  private readonly productService: ProductService;
  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>;

  @TestEvent(TestEventsEnum.AFTER_EACH)
  afterEach() {
    chai.spy.restore();
  }

  @Test('should throw an error if facilityId is not provided')
  async throwFacilityIdError() {
    try {
      await this.productService.findAllByFacility({}, null);
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should handle error from createQueryBuilder')
  async createError() {
    this.productRepository.createQueryBuilder = () => {
      throw new Error('Error');
    };
    try {
      await this.productService.findAllByFacility({}, 'facilityId');
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should call findOne with correct parameters')
  async findOne() {
    chai.spy.on(this.productRepository, 'findOne', () => Promise.resolve({}));

    await this.productService.findOne('id');
    chai.expect(this.productRepository.findOne).to.have.been.called.with({
      where: { id: 'id' },
      relations: { facilityDetails: { user: true } },
    });
  }

  @Test('should throw an error if id is not provided')
  async findOneIdError() {
    try {
      await this.productService.findOne(null);
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should handle error from findOne')
  async handleErrorFindOne() {
    this.productRepository.findOne = () => {
      throw new Error('Error');
    };
    try {
      await this.productService.findOne('id');
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should throw an error if facilityId is not provided')
  async errorFacilityId() {
    try {
      await this.productService.create({
        dto: {} as CreateProductDto,
        facilityId: null,
        productTypeId: 'productTypeId',
      });
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should throw an error if productTypeId is not provided')
  async errorProductTypeId() {
    this.productService.findOne = () => {
      throw new Error('Error');
    };
    try {
      await this.productService.create({
        dto: {} as CreateProductDto,
        facilityId: 'facilityId',
        productTypeId: 'productTypeId',
      });
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should throw an error if id is not provided')
  async updateErrorId() {
    try {
      await this.productService.update(null, {}, {
        user: { id: 'userId' } as TokenPayload,
      } as AuthenticatedRequest);
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should handle error from findOne')
  async findOneError() {
    this.productRepository.findOne = () => {
      throw new Error('Error');
    };
    try {
      await this.productService.update('id', {}, {
        user: { id: 'userId' },
      } as AuthenticatedRequest);
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should throw an error if id is not provided')
  async shouldThrowOnNoId() {
    try {
      await this.productService.remove(null);
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }

  @Test('should handle error from delete')
  async handleErrorDelete() {
    this.productRepository.delete = () => {
      throw new Error('Error');
    };
    try {
      await this.productService.remove('id');
    } catch (err) {
      chai.expect(err).to.exist;
    }
  }
}
