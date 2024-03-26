import { HttpException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Test,
  TestEvent,
  TestEventsEnum,
  TestEventsSuite,
  TestSuite,
} from 'nestjs-mocha-decorators';
import { ProductTypeService } from 'src/product-type/product-type.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { FacilityDetails } from './facility-details.entity';
import { FacilityDetailsService } from './facility-details.service';

const chai: Chai.ChaiStatic = require('chai'),
  spies = require('chai-spies');

chai.use(spies);

@TestEventsSuite()
@TestSuite('Facility Details Service')
export class FacilityDetailsServiceTest {
  @Inject()
  private readonly facilityDetailsService: FacilityDetailsService;
  @Inject()
  private readonly userService: UserService;
  @InjectRepository(FacilityDetails)
  private readonly facilityDetailsRepository: Repository<FacilityDetails>;
  @Inject()
  private readonly productTypeService: ProductTypeService;

  @TestEvent(TestEventsEnum.AFTER_EACH)
  afterEach() {
    chai.spy.restore();
  }

  @Test('should create a facility detail')
  async testCreate() {
    const facilityDetailsDto = {
      address: '123 St',
      name: 'Facility',
      code: 'F123',
    };

    const userId = '1';
    const user = { id: '1', name: 'User' };

    chai.spy.on(this.userService, 'getUserById', () => Promise.resolve(user));

    chai.spy.on(this.facilityDetailsRepository, 'save', () =>
      Promise.resolve({ ...facilityDetailsDto, user }),
    );

    chai.spy.on(this.productTypeService, 'createMany', () => Promise.resolve());

    const result = await this.facilityDetailsService.create(
      facilityDetailsDto,
      userId,
    );

    chai.expect(result).to.deep.equal({ ...facilityDetailsDto, user });
  }

  @Test(
    'should throw an error if user not found when creating a facility detail',
  )
  async testCreateUserNotFound() {
    const facilityDetailsDto = {
      address: '123 St',
      name: 'Facility',
      code: 'F123',
    };

    const userId = '1';

    chai.spy.on(this.userService, 'getUserById', () => Promise.resolve(null));

    try {
      await this.facilityDetailsService.create(facilityDetailsDto, userId);
    } catch (error) {
      chai.expect(error).to.be.instanceOf(HttpException);
    }
  }

  @Test('should get all facility details by user id')
  async testGetAllByUserId() {
    const userId = '1';
    const facilityDetails = {
      id: '1',
      name: 'Facility 1',
      user: { id: userId },
    };

    chai.spy.on(this.facilityDetailsRepository, 'createQueryBuilder', () => ({
      select: () => ({
        where: () => ({
          leftJoinAndSelect: () => ({
            getMany: () => Promise.resolve(facilityDetails),
          }),
        }),
      }),
    }));

    const result = await this.facilityDetailsService.getAllByUserId(userId);
    chai.expect(result).to.deep.equal(facilityDetails);
  }

  @Test('should get one facility detail by id')
  async testGetOne() {
    const id = '1';
    const facilityDetails = { id, name: 'Facility 1' };

    chai.spy.on(this.facilityDetailsRepository, 'findOne', () =>
      Promise.resolve(facilityDetails),
    );

    const result = await this.facilityDetailsService.getOneById(id);

    chai.expect(result).to.deep.equal(facilityDetails);
  }

  @Test('should remove a facility detail')
  async testRemove() {
    const id = '1';
    chai.spy.on(this.facilityDetailsRepository, 'delete', () =>
      Promise.resolve(),
    );

    await this.facilityDetailsService.remove(id);

    chai
      .expect(this.facilityDetailsRepository.delete)
      .to.have.been.called.with(id);
  }

  @Test('should update a facility detail')
  async testUpdate() {
    const id = '1';
    const facilityDetailsDto = {
      address: '123 St',
      name: 'Facility',
      code: 'F123',
    };

    const updatedFacilityDetails = { ...facilityDetailsDto, id };

    chai.spy.on(this.facilityDetailsRepository, 'update', () =>
      Promise.resolve(),
    );

    chai.spy.on(this.facilityDetailsRepository, 'findOne', () =>
      Promise.resolve(updatedFacilityDetails),
    );

    const result = await this.facilityDetailsService.update(
      id,
      facilityDetailsDto,
    );

    chai.expect(result).to.deep.equal(updatedFacilityDetails);
  }
}
