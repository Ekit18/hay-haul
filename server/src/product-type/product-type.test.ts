import { HttpException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Test,
  TestEvent,
  TestEventsEnum,
  TestEventsSuite,
  TestSuite,
} from 'nestjs-mocha-decorators';
import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { FacilityDetailsService } from 'src/facility-details/facility-details.service';
import { Repository } from 'typeorm';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { ProductType } from './product-type.entity';
import { ProductTypeService } from './product-type.service';

const chai: Chai.ChaiStatic = require('chai'),
  spies = require('chai-spies');

chai.use(spies);

@TestEventsSuite()
@TestSuite('Product Type Service')
export class ProductTypeServiceTest {
  @Inject()
  private readonly productTypeService: ProductTypeService;
  @Inject()
  private readonly facilityDetailsService: FacilityDetailsService;
  @InjectRepository(ProductType)
  private readonly productTypeRepository: Repository<ProductType>;

  @TestEvent(TestEventsEnum.AFTER_EACH)
  afterEach() {
    chai.spy.restore();
  }

  @Test('should create many product types')
  async createMany() {
    const productTypeNames = ['type1', 'type2'];
    const facility = new FacilityDetails();
    facility.id = '1';

    const saveSpy = chai.spy.on(this.productTypeRepository, 'save', () =>
      Promise.resolve(),
    );
    const createSpy = chai.spy.on(
      this.productTypeRepository,
      'create',
      () => [],
    );

    await this.productTypeService.createMany(productTypeNames, facility);

    chai.expect(createSpy).to.have.been.called.with(
      productTypeNames.map((name) => ({
        name,
        facilityDetailsId: facility.id,
      })),
    );
    chai.expect(saveSpy).to.have.been.called();
  }

  @Test('should find all product types by facility')
  async findAllByFacility() {
    const facilityId = '1';
    const findSpy = chai.spy.on(this.productTypeRepository, 'find', () =>
      Promise.resolve([]),
    );

    await this.productTypeService.findAllByFacility(facilityId);

    chai
      .expect(findSpy)
      .to.have.been.called.with({ where: { facilityDetailsId: facilityId } });
  }

  @Test('should find one product type by id')
  async findOne() {
    const id = '1';
    const findOneSpy = chai.spy.on(this.productTypeRepository, 'findOne', () =>
      Promise.resolve(),
    );

    await this.productTypeService.findOneById(id);

    chai.expect(findOneSpy).to.have.been.called.with({ where: { id } });
  }

  @Test('should create a product type')
  async create() {
    const productType = new CreateProductTypeDto();
    const facilityId = '1';
    const facilityDetails = new FacilityDetails();
    facilityDetails.id = facilityId;

    const saveSpy = chai.spy.on(this.productTypeRepository, 'save', () =>
      Promise.resolve(),
    );
    const getOneByIdSpy = chai.spy.on(
      this.facilityDetailsService,
      'getOneById',
      () => Promise.resolve(facilityDetails),
    );

    await this.productTypeService.create(productType, facilityId);

    chai.expect(getOneByIdSpy).to.have.been.called.with(facilityId);
    chai.expect(saveSpy).to.have.been.called.with(productType);
  }

  @Test('should update a product type')
  async update() {
    const productType = new CreateProductTypeDto();
    const id = 'b88bb675-f9d1-47b5-9f72-65405e03403f';

    const updateSpy = chai.spy.on(this.productTypeRepository, 'update', () =>
      Promise.resolve(),
    );
    const findOneSpy = chai.spy.on(this.productTypeRepository, 'findOne', () =>
      Promise.resolve(),
    );

    await this.productTypeService.update({ productType, id });

    chai.expect(updateSpy).to.have.been.called.with(id, productType);
  }

  @Test('should delete a product type')
  async deleteProductType() {
    const id = '1';
    const deleteSpy = chai.spy.on(this.productTypeRepository, 'delete', () =>
      Promise.resolve(),
    );

    await this.productTypeService.delete(id);

    chai.expect(deleteSpy).to.have.been.called.with(id);
  }

  @Test(
    'should throw an error when creating a product type with a non-existent facility',
  )
  async throwsErrorWithNonExistentFacility() {
    const productType = new CreateProductTypeDto();
    const facilityId = '1';

    const getOneByIdSpy = chai.spy.on(
      this.facilityDetailsService,
      'getOneById',
      () => Promise.resolve(null),
    );

    try {
      await this.productTypeService.create(productType, facilityId);
    } catch (error) {
      chai.expect(error).to.be.instanceOf(HttpException);
      chai.expect(getOneByIdSpy).to.have.been.called.with(facilityId);
    }
  }
}
