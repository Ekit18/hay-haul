import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TransportService } from './transport.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllowedRoles } from 'src/lib/decorators/roles-auth.decorator';
import { UserRole } from 'src/user/user.entity';
import { UpdateTransportDto } from './dto/update-transport.dto';

@UseGuards(JwtAuthGuard)
@AllowedRoles(UserRole.Carrier, UserRole.Driver)
@Controller('transport')
export class TransportController {
    constructor(private readonly transportService: TransportService) { }

    @Post('/carrier/:carrierId')
    async createTransport(@Body() createTransportDto: CreateTransportDto, @Param('carrierId') carrierId: string) {
        return await this.transportService.create(createTransportDto, carrierId);
    }

    @Delete(':id')
    async deleteTransport(@Param('id') id: string) {
        return await this.transportService.delete(id);
    }

    @Put(':id')
    async updateTransport(@Param('id') id: string, @Body() updateTransportDto: UpdateTransportDto) {
        return await this.transportService.update(id, updateTransportDto);
    }

    @Get('carrier/:carrierId')
    async getTransportsByCarrierId(@Param('carrierId') carrierId: string, @Query('isAvailable') isAvailable: boolean) {
        return await this.transportService.getTransportsByCarrierId(carrierId, isAvailable);
    }

    @Get('driver/:driverId')
    async getTransportsByDriverId(@Param('driverId') driverId: string) {
        return await this.transportService.getTransportsByDriverId(driverId);
    }

    @Get(':id')
    async getTransportById(@Param('id') id: string) {
        return await this.transportService.getTransportById(id);
    }
}
