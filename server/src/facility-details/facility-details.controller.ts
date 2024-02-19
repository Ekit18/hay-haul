import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateFacilityDetailsDto } from './dto/create-facility-details.dto';
import { UpdateFacilityDetailsDto } from './dto/update-facility-details.dto copy';
import { FacilityDetailsService } from './facility-details.service';

@Controller('facility-details')
export class FacilityDetailsController {
  public constructor(
    private readonly facilityDetailsService: FacilityDetailsService,
  ) {}

  @Post('/user/:userId')
  public async createFacilityDetails(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateFacilityDetailsDto,
  ) {
    return await this.facilityDetailsService.create(dto, userId);
  }

  @Get('/')
  public async getAllFacilityDetails() {
    return await this.facilityDetailsService.getAll();
  }

  @Get('/user/:userId')
  public async getFacilityDetailsByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return await this.facilityDetailsService.getAllByUserId(userId);
  }

  @Get('/:id')
  public async getFacilityDetailsById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.facilityDetailsService.getOneById(id);
  }

  @Put('/:id')
  public async updateFacilityDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFacilityDetailsDto,
  ) {
    return await this.facilityDetailsService.update(id, dto);
  }

  @Delete('/:id')
  public async deleteFacilityDetails(@Param('id', ParseUUIDPipe) id: string) {
    return await this.facilityDetailsService.remove(id);
  }
}
