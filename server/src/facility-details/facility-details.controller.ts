import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthErrorMessage } from 'src/auth/auth-error-message.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { getSwaggerResponseDescription } from 'src/lib/helpers/getSwaggerResponseDescription';
import { UserErrorMessage } from 'src/user/user-error-message.enum';
import { CreateFacilityDetailsDto } from './dto/create-facility-details.dto';
import { UpdateFacilityDetailsDto } from './dto/update-facility-details.dto';
import { FacilityDetailsService } from './facility-details.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('facility-details')
@Controller('facility-details')
export class FacilityDetailsController {
  public constructor(
    private readonly facilityDetailsService: FacilityDetailsService,
  ) {}

  @ApiOperation({ summary: 'Create facility details' })
  @ApiCreatedResponse({ description: 'Facility created' })
  @ApiBadRequestResponse({
    description: getSwaggerResponseDescription(
      UserErrorMessage.FailedToGetUser,
      AuthErrorMessage.UserNotFound,
    ),
  })
  @Post('/user/:userId')
  public async createFacilityDetails(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateFacilityDetailsDto,
  ) {
    return await this.facilityDetailsService.create(dto, userId);
  }

  @ApiOperation({ summary: "Get user's facility details" })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to fetch' })
  @Get('/user/:userId')
  public async getFacilityDetailsByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return await this.facilityDetailsService.getAllByUserId(userId);
  }

  @ApiOperation({ summary: 'Get facility details by id' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to fetch' })
  @Get('/:id')
  public async getFacilityDetailsById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.facilityDetailsService.getOneById(id);
  }

  @ApiOperation({ summary: 'Update facility details' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to update' })
  @Put('/:id')
  public async updateFacilityDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFacilityDetailsDto,
  ) {
    return await this.facilityDetailsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete facility details' })
  @ApiOkResponse({ description: 'Operation successful' })
  @ApiBadRequestResponse({ description: 'Failed to delete' })
  @Delete('/:id')
  public async deleteFacilityDetails(@Param('id', ParseUUIDPipe) id: string) {
    return await this.facilityDetailsService.remove(id);
  }
}
