import { Controller, Delete, Get, Put, UseGuards, Post, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { UserRole } from 'src/user/user.entity';
import { DriverDetailsService } from './driver-details.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Carrier)
@Controller('driver-details')
export class DriverDetailsController {
    constructor(private readonly driverDetailsService: DriverDetailsService) { }

    @Post('/carrier/:carrierId')
    async createDriver(@Body() createDriverDto: CreateDriverDto, @Param('carrierId') carrierId: string) {
        return await this.driverDetailsService.createDrive(carrierId, createDriverDto);
    }

    @Delete(':id')
    async deleteDriver(@Param('id') id: string) {
        return await this.driverDetailsService.delete(id);
    }

    @Put(':id')
    async updateDriver(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
        return await this.driverDetailsService.update(id, updateDriverDto);
    }

    @Get('carrier/:id')
    async getAllCarrierDrivers(@Param('id') id: string) {
        return await this.driverDetailsService.getAllCarrierDrivers(id);
    }

    @Get(':id')
    async getDriverById(@Param('id') id: string) {
        return await this.driverDetailsService.getDriverById(id);
    }
}
