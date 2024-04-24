import { Controller, Delete, Get, Put, UseGuards, Post, Body, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { UserRole } from 'src/user/user.entity';
import { DriverDetailsService } from './driver-details.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { RegeneratePasswordDriverDto } from './dto/regenerate-password-driver.dto';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Carrier)
@Controller('driver-details')
export class DriverDetailsController {
    constructor(private readonly driverDetailsService: DriverDetailsService) { }

    @Post('/carrier/:carrierId')
    async createDriver(@Body() createDriverDto: CreateDriverDto, @Param('carrierId') carrierId: string) {
        await this.driverDetailsService.createDriver(carrierId, createDriverDto);
    }

    @Get('carrier/:carrierId')
    async getAllCarrierDrivers(@Param('carrierId') carrierId: string, @Query('isAvailable') isAvailable?: boolean) {
        return await this.driverDetailsService.getAllCarrierDrivers(carrierId, { isAvailable });
    }

    @Get(':id')
    async getDriverById(@Param('id') id: string) {
        return await this.driverDetailsService.getDriverById(id);
    }

    @Delete(':id')
    async deleteDriver(@Param('id') id: string) {
        return await this.driverDetailsService.delete(id);
    }

    @Put(':id')
    async updateDriver(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
        return await this.driverDetailsService.update(id, updateDriverDto);
    }

    @Post('regenerate-password/:driverId')
    async regeneratePassword(@Param('driverId') driverId: string, @Body() dto: RegeneratePasswordDriverDto) {
        return await this.driverDetailsService.regeneratePassword(driverId, dto);
    }
}
